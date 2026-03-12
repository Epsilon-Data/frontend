import {
  generateProxyToken,
  listProxyTokens,
  revokeProxyToken,
  getProxyStatus,
  deleteProxy,
  InstallTokenSummary,
  GenerateTokenResponse,
  ProxyStatus,
} from '@app/api/proxy.api';
import { Button, Input, message, Modal, Popconfirm, Table, Tag, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { FiCopy, FiPlus, FiTrash2 } from 'react-icons/fi';
import { HiOutlineStatusOnline, HiOutlineStatusOffline } from 'react-icons/hi';
import { AiOutlineDisconnect } from 'react-icons/ai';

const { Text, Paragraph } = Typography;

type Props = {
  projectId: string;
};

export const ProxyTokenManager = ({ projectId }: Props) => {
  const [tokens, setTokens] = useState<InstallTokenSummary[]>([]);
  const [proxyStatus, setProxyStatus] = useState<ProxyStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [tokenName, setTokenName] = useState('');
  const [newToken, setNewToken] = useState<GenerateTokenResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tokenList, status] = await Promise.all([
        listProxyTokens(projectId),
        getProxyStatus(projectId).catch(() => null),
      ]);
      setTokens(tokenList);
      setProxyStatus(status);
    } catch {
      message.error('Failed to load proxy tokens');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGenerate = async () => {
    if (!tokenName.trim()) return;
    setGenerating(true);
    try {
      const result = await generateProxyToken(projectId, tokenName.trim());
      setNewToken(result);
      setShowGenerateModal(false);
      setTokenName('');
      fetchData();
    } catch {
      message.error('Failed to generate token');
    } finally {
      setGenerating(false);
    }
  };

  const handleRevoke = async (tokenId: string) => {
    try {
      await revokeProxyToken(projectId, tokenId);
      message.success('Token revoked');
      fetchData();
    } catch {
      message.error('Failed to revoke token');
    }
  };

  const handleCopy = () => {
    if (!newToken) return;
    navigator.clipboard.writeText(newToken.installToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCommand = () => {
    if (!newToken) return;
    const cmd = `epsilon-proxy register --token ${newToken.installToken}`;
    navigator.clipboard.writeText(cmd);
    message.success('Command copied to clipboard');
  };

  const handleUnregister = async () => {
    try {
      await deleteProxy(projectId);
      message.success('Proxy unregistered');
      fetchData();
    } catch {
      message.error('Failed to unregister proxy');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong className="text-sm">{name}</Text>,
    },
    {
      title: 'Token',
      dataIndex: 'tokenPrefix',
      key: 'tokenPrefix',
      render: (prefix: string) => (
        <Text code className="text-xs">{prefix}{'...'}</Text>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Text type="secondary" className="text-xs">
          {new Date(date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
          })}
        </Text>
      ),
    },
    {
      title: 'Last used',
      dataIndex: 'lastUsedAt',
      key: 'lastUsedAt',
      render: (date?: string) =>
        date ? (
          <Text type="secondary" className="text-xs">
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </Text>
        ) : (
          <Text type="secondary" className="text-xs italic">Never</Text>
        ),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_: unknown, record: InstallTokenSummary) => (
        <Popconfirm
          title="Revoke this token?"
          description="Any proxy using this token will not be able to re-register."
          onConfirm={() => handleRevoke(record.id)}
          okText="Revoke"
          okButtonProps={{ danger: true }}
        >
          <Button type="text" danger size="small" icon={<FiTrash2 />} />
        </Popconfirm>
      ),
    },
  ];

  const statusTag = proxyStatus ? (
    proxyStatus.status === 'ONLINE' ? (
      <Tag color="green" icon={<HiOutlineStatusOnline className="inline mr-1" />}>Online</Tag>
    ) : proxyStatus.status === 'OFFLINE' ? (
      <Tag color="red" icon={<HiOutlineStatusOffline className="inline mr-1" />}>Offline</Tag>
    ) : (
      <Tag color="default">Pending registration</Tag>
    )
  ) : null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Proxy status */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Text strong className="text-lg block">Epsilon Proxy</Text>
          <Text type="secondary" className="text-xs">
            Manage install tokens for your proxy agent
          </Text>
        </div>
        <div className="flex items-center gap-2">
          {statusTag}
          {proxyStatus && proxyStatus.status !== 'PENDING' && (
            <Popconfirm
              title="Unregister proxy?"
              description="This will disconnect the proxy and delete its credentials. You'll need to re-register with a new token."
              onConfirm={handleUnregister}
              okText="Unregister"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                size="small"
                icon={<AiOutlineDisconnect />}
              >
                Unregister
              </Button>
            </Popconfirm>
          )}
        </div>
      </div>

      {/* Install instructions */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <Text strong className="text-sm">Quick start</Text>
        <div className="bg-gray-900 text-green-400 rounded-md p-3 font-mono text-xs leading-relaxed mt-2">
          <div># 1. Install epsilon-proxy</div>
          <div className="text-white">curl -fsSL https://raw.githubusercontent.com/Epsilon-Data/epsilon-proxy/main/scripts/install.sh | sh</div>
          <div className="mt-2"># 2. Register with your token</div>
          <div className="text-white">epsilon-proxy register --token {'<TOKEN>'}</div>
          <div className="mt-2"># 3. Start the proxy</div>
          <div className="text-white">epsilon-proxy start</div>
        </div>
        <Paragraph type="secondary" className="text-xs mt-2 mb-0">
          Credentials are stored locally on your machine — they are never sent to the platform.
        </Paragraph>
      </div>

      {/* Token table */}
      <div className="flex items-center justify-between mb-3">
        <Text strong className="text-sm">Install tokens</Text>
        <Button
          type="primary"
          size="small"
          icon={<FiPlus />}
          onClick={() => setShowGenerateModal(true)}
        >
          Generate new token
        </Button>
      </div>

      <Table
        dataSource={tokens}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
        locale={{ emptyText: 'No tokens yet. Generate one to get started.' }}
      />

      {/* Generate modal */}
      <Modal
        title="Generate new install token"
        open={showGenerateModal}
        onCancel={() => { setShowGenerateModal(false); setTokenName(''); }}
        onOk={handleGenerate}
        okText="Generate"
        confirmLoading={generating}
        okButtonProps={{ disabled: !tokenName.trim() }}
      >
        <div className="py-4 px-2">
          <Text className="text-sm block mb-3">
            Give this token a descriptive name so you can identify it later.
          </Text>
          <Input
            placeholder="e.g. Production server, Staging DB"
            value={tokenName}
            onChange={(e) => setTokenName(e.target.value)}
            onPressEnter={handleGenerate}
            maxLength={100}
            autoFocus
          />
        </div>
      </Modal>

      {/* Show-once token modal */}
      <Modal
        title="Token generated"
        open={!!newToken}
        onCancel={() => { setNewToken(null); setCopied(false); }}
        footer={[
          <Button key="done" type="primary" onClick={() => { setNewToken(null); setCopied(false); }}>
            Done
          </Button>,
        ]}
        closable={false}
        maskClosable={false}
      >
        {newToken && (
          <div className="py-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
              <Text strong className="text-yellow-800 text-xs">
                Make sure to copy your token now. You won't be able to see it again.
              </Text>
            </div>

            <Text className="text-xs text-gray-500 block mb-1">{newToken.name}</Text>
            <div className="flex gap-2 items-center">
              <Input.TextArea
                value={newToken.installToken}
                readOnly
                autoSize={{ minRows: 1, maxRows: 2 }}
                className="font-mono text-xs"
              />
              <Button
                icon={<FiCopy />}
                onClick={handleCopy}
                type={copied ? 'primary' : 'default'}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>

            <div className="mt-4">
              <Text type="secondary" className="text-xs block mb-1">Register command:</Text>
              <div
                className="bg-gray-900 text-green-400 rounded-md p-2 font-mono text-xs cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={handleCopyCommand}
                title="Click to copy"
              >
                epsilon-proxy register --token {newToken.installToken}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

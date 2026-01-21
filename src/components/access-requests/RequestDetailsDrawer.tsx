import { STATUS_COLORS, STATUS_NAMES } from '@app/constants/accessRequest';
import { AccessRequest } from '@app/hooks/useAccessRequests';
import { Button, Col, Drawer, Form, message, Select, Tag } from 'antd';
import { IoIosArrowDown } from 'react-icons/io';
import { DetailsRow } from '../browse-projects/modal/pages/AboutDatasetPage/components/DetailsRow';
import { useTranslation } from 'react-i18next';
import { LoaderWrapper } from '@app/components/common/LoaderWrapper';

import {
  approveRequest,
  createComment,
  getComments as getAnalysisRequestComments,
  RequestComment,
} from '@app/api/analysisRequests.api';
import { getComments as getConnectionRequestComments } from '@app/api/connectionRequests.api';
import { useEffect, useMemo, useState } from 'react';
import { IoPersonCircle } from 'react-icons/io5';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { CommentSection } from '../analysis-requests/CommentSection';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { useDatabaseModalContext } from '@app/hooks/useDatabaseModalContext';

type RequestDetailsDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  request: AccessRequest | null;
  drawerLoading: boolean;
};
export const RequestDetailsDrawer = ({ open, setOpen, request, drawerLoading }: RequestDetailsDrawerProps) => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<string>(request?.status ?? 'PENDING');
  const projectId = searchParams.get('id') ?? '';
  const user = useAppSelector((state) => state.user.user);
  const { t } = useTranslation();
  const [comments, setComments] = useState<RequestComment[]>(request?.comments ?? []);
  const [showComment, setShowComment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { showModal } = useDatabaseModalContext();

  const [form] = Form.useForm();

  useEffect(() => {
    if (request?.status) setStatus(request.status);
    setComments(request?.comments || []);
  }, [request?.comments, request?.status]);

  const sortedComments = useMemo(
    () => [...comments].sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()),
    [comments],
  );

  const handleSubmit = async (values: { content: string }) => {
    const content = values?.content?.trim();
    if (!content) return;

    setSubmitting(true);

    const optimistic: RequestComment = {
      requestId: request?.requestId ?? '',
      authorId: user?.sub ?? '',
      authorName: `${user?.given_name} ${user?.family_name}`,
      content,
      createdDate: new Date(),
    };

    setComments((prev) => [...prev, optimistic]);

    try {
      await createComment(optimistic, request?.requestId);

      let fresh = [] as RequestComment[];
      if (request?.type === 'CONNECTION') {
        fresh = await getConnectionRequestComments({ isRequestor: false }, request?.requestId);
      } else if (request?.type === 'ANALYSIS') {
        fresh = await getAnalysisRequestComments({ isRequestor: false }, request?.requestId);
      }

      fresh.sort(
        (a: { createdDate: Date }, b: { createdDate: Date }) =>
          new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
      );
      setComments(fresh);

      message.success(t('browse.trackRequests.table.manage.tabs.comments.createdSuccess'));
      form.resetFields();
      setShowComment(false);
    } catch {
      setComments((prev) => prev.filter((c) => c !== optimistic));
      message.error(t('browse.trackRequests.table.manage.tabs.comments.createdError'));
    } finally {
      setSubmitting(false);
    }
  };

  const renderTag = (status: string) => {
    return (
      <Tag variant="outlined" color={STATUS_COLORS[status]} className="rounded-2xl py-0.5 px-3">
        {STATUS_NAMES[status]}
      </Tag>
    );
  };

  const selectOptions = [
    { value: 'PENDING', label: renderTag('PENDING') },
    { value: 'APPROVED', label: renderTag('APPROVED') },
    { value: 'REJECTED', label: renderTag('REJECTED') },
    { value: 'REVISION', label: renderTag('REVISION') },
  ];

  const handleStatusChange = async (value: string) => {
    if (!request) return;
    if (value === status) return;
    const prev = status;
    setStatus(value);
    try {
      if (value === 'APPROVED') {
        if (request.type === 'ANALYSIS') {
          await approveRequest({ projectId, requestId: request.requestId, isApproved: true });
        } else {
          showModal();
        }
      }
    } catch {
      setStatus(prev);
      message.error(t('project.main.projectAccess.drawer.detailsError'));
    }
  };

  return (
    <Drawer
      className="bg-white"
      size={640}
      placement="right"
      closable={{ placement: 'end' }}
      onClose={() => setOpen(false)}
      open={open}
      title={
        <div className="flex items-start gap-2">
          {drawerLoading || !request ? (
            <span className="text-grey-2">Loading…</span>
          ) : (
            <>
              <span>{request.requestor.name}</span>
              <Select
                onChange={handleStatusChange}
                value={status}
                size="small"
                style={{ width: 170, border: 'none' }}
                suffixIcon={<IoIosArrowDown className="mt-1" color="black" />}
                options={selectOptions}
              />
            </>
          )}
        </div>
      }
    >
      <LoaderWrapper
        isLoading={drawerLoading || !request}
        minHeight="55vh"
        fallback={
          <>
            <div className="text-black font-medium text-base mb-5">
              {t('project.main.projectAccess.drawer.requestor.title')}
            </div>
          </>
        }
      >
        <>
          <div className="text-black font-medium text-base mb-5">
            {t('project.main.projectAccess.drawer.requestor.title')}
          </div>
          <DetailsRow
            title={t('project.main.projectAccess.drawer.requestor.position')}
            content={request?.requestor.position || ''}
            titleWidth={7}
            contentWidth={15}
          />
          <DetailsRow
            title={t('project.main.projectAccess.drawer.requestor.email')}
            content={request?.requestor.email || ''}
            titleWidth={7}
            contentWidth={15}
          />
          <DetailsRow
            title={t('project.main.projectAccess.drawer.requestor.orgName')}
            content={request?.requestor.orgName || ''}
            titleWidth={7}
            contentWidth={15}
          />

          <hr className="-mx-6 my-8 border-grey-2" />

          <div className="text-black font-medium text-base mb-5">
            {t('project.main.projectAccess.drawer.project.title')}
          </div>
          <DetailsRow
            title={t('project.main.projectAccess.drawer.project.name')}
            content={request?.project?.name || ''}
            titleWidth={7}
            contentWidth={15}
          />
          <DetailsRow
            title={t('project.main.projectAccess.drawer.project.duration')}
            content={
              request?.project?.startDate && request?.project?.endDate
                ? `${new Date(request?.project?.startDate).getDate()} ${new Date(
                    request?.project?.startDate,
                  ).toLocaleString('en-GB', {
                    month: 'long',
                  })}, ${new Date(request?.project?.startDate).getFullYear()} - ${new Date(
                    request?.project?.endDate,
                  ).getDate()} ${new Date(request?.project?.endDate).toLocaleString('en-GB', {
                    month: 'long',
                  })}, ${new Date(request?.project?.endDate).getFullYear()}`
                : t('browse.main.details.projectDetails.info.notAvailable')
            }
            titleWidth={7}
            contentWidth={15}
          />
          <DetailsRow
            title={t('project.main.projectAccess.drawer.project.describe')}
            content={request?.project?.description ?? '-'}
            titleWidth={7}
            contentWidth={15}
          />
          <hr className="-mx-6 my-8 border-grey-2" />

          <div className="flex items-center mt-4 mb-8">
            <span className="text-lg font-medium font-inter text-black">
              {t('browse.trackRequests.table.manage.tabs.comments.title')}
            </span>
            <span className="text-sm ml-3 font-normal font-inter text-grey-2">{`(${comments.length})`}</span>
          </div>
          {sortedComments.map((comment) => {
            let authorName = comment.authorName;
            if (comment.authorId === user?.sub) authorName = 'You';

            const key = comment.commentId ?? Date.now().toString(36);
            return (
              <div key={key} className="flex flex-col border-b border-grey-3 mb-8">
                <div className="flex justify-between">
                  <div className="flex items-start">
                    <IoPersonCircle size={20} className="text-grey-2 mr-2" />
                    <span className="text-sm text-grey-2 font-light">{authorName}</span>
                  </div>
                  <span className="text-sm text-grey-2 font-light">
                    {dayjs(comment.createdDate).format('D MMM YYYY [at] h.mma')}
                  </span>
                </div>
                <div className="my-4">
                  <span className="text-sm text-grey-1 font-light">{comment.content}</span>
                </div>
              </div>
            );
          })}
          {showComment ? (
            <Col span={12}>
              <CommentSection
                setShowComment={setShowComment}
                form={form}
                onSubmit={handleSubmit}
                submitting={submitting}
              />
            </Col>
          ) : (
            <Button
              className="flex items-center h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
              type="primary"
              onClick={() => setShowComment(true)}
            >
              {t('browse.trackRequests.table.manage.tabs.comments.add')}
            </Button>
          )}
        </>
      </LoaderWrapper>
    </Drawer>
  );
};

import { Button, Col, Form, message, Tabs, TabsProps } from 'antd';
import { DetailsRow } from '@app/components/browse-projects/modal/pages/AboutDatasetPage/components/DetailsRow';
import { useTranslation } from 'react-i18next';
import { AnalysisRequest, createComment, getComments, RequestComment } from '@app/api/analysisRequests.api';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { CommentSection } from './CommentSection';
import { IoPersonCircle } from 'react-icons/io5';
import { useAppSelector } from '@app/hooks/reduxHooks';

type RequestTabsProps = {
  request: AnalysisRequest | null;
};

export const RequestTabs = ({ request }: RequestTabsProps) => {
  const user = useAppSelector((state) => state.user.user);
  const { t } = useTranslation();
  const [showComment, setShowComment] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [comments, setComments] = useState<RequestComment[]>(request?.request?.comments ?? []);

  useEffect(() => {
    setComments(request?.request?.comments || []);
  }, [request?.request?.comments]);

  const sortedComments = useMemo(
    () => [...comments].sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()),
    [comments],
  );

  const handleSubmit = async (values: { content: string }) => {
    const content = values?.content?.trim();
    if (!content) return;

    setSubmitting(true);

    const optimistic: RequestComment = {
      authorId: user?.sub ?? '',
      authorName: user?.name ?? user?.email ?? 'Unknown',
      content,
      createdDate: new Date(),
    };

    setComments((prev) => [...prev, optimistic]);

    try {
      await createComment(optimistic, request?.requestId);

      const fresh = await getComments(request?.requestId);

      fresh.sort(
        (a: { createdDate: Date }, b: { createdDate: Date }) =>
          new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
      );
      setComments(fresh);

      message.success(t('browse.trackRequests.table.manage.tabs.comments.createdSuccess'));
      form.resetFields();
      setShowComment(false);
    } catch (err) {
      setComments((prev) => prev.filter((c) => c !== optimistic));
      message.error(t('browse.trackRequests.table.manage.tabs.comments.createdError'));
    } finally {
      setSubmitting(false);
    }
  };

  const items: TabsProps['items'] = [
    {
      key: 'details',
      label: <span className="text-sm">{t('browse.main.details.projectDetails.title')}</span>,
      children: (
        <>
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.university')}
            content={request?.project?.university ?? '-'}
          />
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.faculty')}
            content={request?.project?.faculty ?? '-'}
          />
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.ethicsId')}
            content={request?.project?.ethicsId ?? '-'}
          />
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.duration')}
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
          />
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.participantsNum')}
            content={request?.project?.participantsNum.toString() ?? '-'}
          />
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.lead')}
            content={request?.project?.lead ?? '-'}
          />
          <DetailsRow
            title={t('browse.main.details.projectDetails.info.members')}
            content={
              request?.project?.members === undefined
                ? t('browse.main.details.projectDetails.info.notAvailable')
                : request.project.members.length === 0
                ? '-'
                : request.project.members.join(', ')
            }
          />
        </>
      ),
    },
    {
      key: 'application',
      label: <span className="text-sm">{t('browse.trackRequests.table.manage.tabs.application.title')}</span>,
      children: (
        <>
          <div className="flex flex-col w-full mt-4 pb-4 border-b border-grey-3">
            <span className="text-lg font-semibold mb-4">
              {t('browse.trackRequests.table.manage.tabs.application.details.title')}
            </span>
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.details.submitted')}
              content={
                request?.request?.createdDate
                  ? dayjs(request?.request?.createdDate).format('D MMM YYYY [at] h.mma')
                  : '-'
              }
            />
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.details.lastUpdated')}
              content={
                request?.request?.createdDate
                  ? dayjs(request?.request?.lastModified).format('D MMM YYYY [at] h.mma')
                  : '-'
              }
            />
          </div>
          <div className="flex flex-col w-full mt-8 pb-4 border-b border-grey-3">
            <span className="text-lg font-semibold mb-4">
              {t('browse.trackRequests.table.manage.tabs.application.requestor.title')}
            </span>
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.requestor.firstName')}
              content={request?.requestorName.split(' ')[0] ?? '-'}
            />
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.requestor.lastName')}
              content={request?.requestorName.split(' ')[1] ?? '-'}
            />
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.requestor.position')}
              content={request?.requestorPosition ?? '-'}
            />
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.requestor.email')}
              content={request?.requestorEmail ?? '-'}
            />
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.requestor.orgName')}
              content={request?.requestorOrgName ?? '-'}
            />
          </div>
          <div className="flex flex-col w-full mt-8 pb-4">
            <span className="text-lg font-semibold mb-4">
              {t('browse.trackRequests.table.manage.tabs.application.project.title')}
            </span>
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.project.name')}
              content={request?.projectName ?? '-'}
            />
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.project.duration')}
              content={
                request?.projectStartDate && request?.projectEndDate
                  ? `${new Date(request?.projectStartDate).toLocaleString('en-GB', {
                      month: 'short',
                    })} ${new Date(request?.projectStartDate).getDate()}, ${new Date(
                      request?.projectStartDate,
                    ).getFullYear()} to ${new Date(request?.projectEndDate).toLocaleString('en-GB', {
                      month: 'short',
                    })} ${new Date(request?.projectEndDate).getDate()}, ${new Date(
                      request?.projectEndDate,
                    ).getFullYear()}`
                  : t('browse.main.details.projectDetails.info.notAvailable')
              }
            />
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.project.describe')}
              content={request?.projectDescription ?? '-'}
            />
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.project.ethics')}
              content={request?.projectEthicsId ?? '-'}
            />
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.project.objective')}
              content={request?.projectObjective ?? '-'}
            />
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.project.outcome')}
              content={request?.projectOutcome ?? '-'}
            />
            <DetailsRow
              title={t('browse.trackRequests.table.manage.tabs.application.project.members')}
              content={
                request?.projectMembers === undefined
                  ? t('browse.main.details.projectDetails.info.notAvailable')
                  : request.projectMembers.length === 0
                  ? '-'
                  : request.projectMembers.join(', ')
              }
            />
          </div>
        </>
      ),
    },
    {
      key: 'comments',
      label: (
        <span className="text-sm">
          {t('browse.trackRequests.table.manage.tabs.comments.title') + ` (${comments.length})`}
        </span>
      ),
      children: (
        <>
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
      ),
    },
  ];
  return <Tabs className="details-tabs" defaultActiveKey="details" items={items} />;
};

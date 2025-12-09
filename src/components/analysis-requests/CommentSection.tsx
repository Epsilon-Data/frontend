import { Button, Form, FormInstance } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { useTranslation } from 'react-i18next';
import { IoChevronForwardOutline } from 'react-icons/io5';

type CommentSectionProps = {
  setShowComment: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<{ content: string }>;
  onSubmit: (values: { content: string }) => void;
  submitting?: boolean;
};

export const CommentSection = ({ setShowComment, form, onSubmit, submitting }: CommentSectionProps) => {
  const { t } = useTranslation();

  return (
    <Form form={form} onFinish={onSubmit}>
      <FormItem name="content">
        <TextArea
          placeholder={t('browse.trackRequests.table.manage.tabs.comments.inputPlaceholder')}
          rows={4}
          className="bg-grey-3 border border-grey-2 [&::placeholder]:text-grey-1"
        />
      </FormItem>
      <div className="flex items-center justify-end">
        <Button
          key="back"
          onClick={() => setShowComment(false)}
          className="flex items-center h-8 text-blueDark text-xs font-medium font-inter mr-3"
        >
          {t('common.back')}
        </Button>
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          icon={<IoChevronForwardOutline />}
          iconPlacement="end"
          loading={submitting}
          disabled={submitting}
          className="flex items-center h-8 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
        >
          {t('common.submit')}
        </Button>
      </div>
    </Form>
  );
};

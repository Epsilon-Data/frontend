import { Button, Form, FormInstance } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { useTranslation } from 'react-i18next';
import { IoChevronForwardOutline } from 'react-icons/io5';

type CommentSectionProps = {
  setShowComment: React.Dispatch<React.SetStateAction<boolean>>;
  form: FormInstance<unknown>;
};

export const CommentSection = ({ setShowComment, form }: CommentSectionProps) => {
  const { t } = useTranslation();

  return (
    <Form form={form}>
      <FormItem>
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
          type="primary"
          icon={<IoChevronForwardOutline />}
          iconPosition="end"
          className="flex items-center h-8 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
        >
          {t('common.submit')}
        </Button>
      </div>
    </Form>
  );
};

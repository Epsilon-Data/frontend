import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Button, Form, Input, Modal, Radio, Select, Space } from 'antd';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiMiniListBullet } from 'react-icons/hi2';
import { FaPlus } from 'react-icons/fa6';
import { IoIosArrowDown } from 'react-icons/io';
import { IoChevronForwardOutline, IoSearch } from 'react-icons/io5';
import { ArchetypeList } from '@app/components/common/ArchetypeList/ArchetypeList';
import { getArchetypes } from '@app/api/archetypes.api';
import { useNavigate } from 'react-router-dom';
import { Archetype } from '@app/api/archetypes.api';
import config from '@app/config/config';
import { ModalStepHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { ModalInput } from '@app/components/common/Modal/ModalInput/ModalInput';

const getInitialFormValues = () => {
  if (config.isDev) {
    return {
      name: 'archetype test',
      nodes: [],
      edges: [],
      mapping: [],
      permissions: [],
    };
  }

  return {
    name: '',
    nodes: [],
    edges: [],
    mapping: [],
    permissions: [],
  };
};

const MetadataPage: React.FC = () => {
  const [step1] = Form.useForm();
  const [step3] = Form.useForm();

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [isFormLoading, setFormLoading] = useState(false);
  const id = new URLSearchParams(window.location.search).get('id');

  const stepTitles = [
    t('project.createTemplate.form.step1.title'),
    t('project.createTemplate.form.step2.title'),
    t('project.createTemplate.form.step3.title'),
    t('project.createTemplate.form.step4.title'),
  ];

  const nextStep = () => setModalStep((prev) => Math.min(prev + 1, 4));

  const handleChange = (value: string | string[]) => {
    console.log(`selected ${value}`);
  };

  const showModal = () => {
    const initialValues = getInitialFormValues();

    step1.setFieldsValue({
      name: initialValues.name,
    });

    step3.setFieldsValue({
      permissions: initialValues.permissions,
    });
    setIsModalOpen(true);
    setModalStep(0);
  };

  const fetch = useCallback(() => {
    if (id) {
      getArchetypes(id).then((res) => {
        setArchetypes(res);
      });
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleArchetypeClick = (archetypeId: string) => {
    console.log(archetypeId);
    navigate(`/`);
  };

  const handleDraft = () => {};

  const handleCreate = async () => {
    setFormLoading(true);
    const formData = {
      name: step1.getFieldValue('name'),
    };

    // createArchetype(formData);
    console.log(formData);
    setFormLoading(false);
    setIsModalOpen(false);
  };

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      <PageTitle>{t('project.title')}</PageTitle>
      <div className="flex items-center justify-between w-full mt-8 pb-4 border-b border-grey-3">
        <div className="text-xl font-medium font-sans">{t('project.main.dbMapping.title')}</div>
        <div className="flex items-center gap-4 flex-wrap justify-end">
          <Space.Compact className="rounded-lg">
            <Input
              className="px-2 py-1 text-xs font-inter h-8"
              prefix={<IoSearch className="text-grey-1 mr-2" />}
              placeholder="Search projects..."
            />
          </Space.Compact>
          <Select
            className="sort-select text-xs font-medium font-sans w-48"
            prefix="Sort by: "
            defaultValue="date-created"
            suffixIcon={<IoIosArrowDown className="mt-1" />}
            onChange={handleChange}
            options={[
              { value: 'date-created', label: 'Date created' },
              { value: 'title', label: 'Title' },
              { value: 'last-modified', label: 'Last modified' },
            ]}
          />
          <Space>
            <Radio.Group
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="flex bg-grey-3 rounded-md p-1 gap-1"
            >
              <Radio.Button value="grid" className="flex items-center rounded-r-md z-2">
                <HiOutlineViewGrid />
              </Radio.Button>
              <Radio.Button value="list" className="flex items-center rounded-l-md z-2 border">
                <HiMiniListBullet />
              </Radio.Button>
            </Radio.Group>
          </Space>
          <Button
            className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
            type="primary"
            icon={<FaPlus />}
            onClick={showModal}
          >
            {t('project.main.dbMapping.newTemplate')}
          </Button>
        </div>
      </div>
      <div className="column items-start mt-12">
        <ArchetypeList archetypes={archetypes} layout={layout} onArchetypeClick={handleArchetypeClick} />
      </div>
      <Modal
        open={isModalOpen}
        width={'60%'}
        footer={[
          modalStep < 4 ? (
            <Button
              key="next"
              type="primary"
              onClick={nextStep}
              icon={<IoChevronForwardOutline />}
              iconPosition="end"
              className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
            >
              {t('common.next')}
            </Button>
          ) : (
            <Button
              key="submit"
              type="primary"
              onClick={handleCreate}
              icon={<IoChevronForwardOutline />}
              iconPosition="end"
              loading={isFormLoading}
              className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
            >
              {t('project.createTemplate.form.submit')}
            </Button>
          ),
        ]}
        closable={false}
        mask
      >
        {modalStep === 0 && (
          <div className="flex flex-col">
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
              stepTitles={stepTitles}
            />
            <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center">
              <Form form={step1}>
                <ModalInput
                  name="name"
                  inputTitle={t('project.createTemplate.form.step1.name.title')}
                  inputDescription={t('project.createTemplate.form.step1.name.description')}
                  large
                />
              </Form>
            </div>
          </div>
        )}
        {modalStep === 1 && (
          <div className="flex flex-col">
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
              stepTitles={stepTitles}
            />
            <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center"></div>
          </div>
        )}
        {modalStep === 2 && (
          <div className="flex flex-col">
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
              stepTitles={stepTitles}
            />
            <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center"></div>
          </div>
        )}
        {modalStep === 3 && (
          <div className="flex flex-col">
            <ModalStepHeader
              setModalStep={setModalStep}
              modalStep={modalStep}
              setIsModalOpen={setIsModalOpen}
              handleDraft={handleDraft}
              stepTitles={stepTitles}
            />
            <div className="h-[33rem] py-12 px-20 overflow-y-auto flex flex-col justify-center"></div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MetadataPage;

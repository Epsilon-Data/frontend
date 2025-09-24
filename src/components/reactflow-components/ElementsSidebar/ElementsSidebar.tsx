import { Button, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { LuRedo, LuUndo } from 'react-icons/lu';
import { PiLightbulbBold } from 'react-icons/pi';
import { TiWarningOutline } from 'react-icons/ti';
import { Panel } from 'reactflow';

export const ElementsSidebar: React.FC<{ name: string }> = ({ name }) => {
  const { Text } = Typography;
  const { t } = useTranslation();

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <>
      <Panel position="top-left">
        <div className="flex text-start bg-white border border-[#ddd] rounded-lg text-base p-3 w-60 mb-4 shadow-xl">
          {name}
        </div>
        <div className="flex flex-col bg-white border border-[#ddd] rounded-lg p-3 w-60 mb-4 shadow-xl">
          <div className="text-sm text-start mb-2">{t('project.createTemplate.form.step2.sidebar.blocks')}</div>
          <div
            className="dndnode object bg-element-categoryBg text-center mb-2 rounded-lg py-2 w-5/6 text-white"
            onDragStart={(event) => onDragStart(event, 'category')}
            draggable
          >
            {t('project.createTemplate.form.step2.sidebar.category')}
          </div>
          <div
            className="dndnode object bg-element-subcategoryBg text-center mb-2 rounded-lg py-2 w-5/6 text-white"
            onDragStart={(event) => onDragStart(event, 'subcategory')}
            draggable
          >
            {t('project.createTemplate.form.step2.sidebar.subcategory')}
          </div>
          <div className="text-sm text-start my-2">{t('project.createTemplate.form.step2.sidebar.rules')}</div>
          <div className="font-light text-gray text-xs pb-0">
            <Text className="font-bold text-blueDark mr-2">•</Text> Parent → Category
          </div>
          <div className="font-light text-gray text-xs">
            <Text className="font-bold text-blueDark mr-2">•</Text> Category → Sub-category
          </div>
          <div className="flex items-center mt-2">
            <TiWarningOutline size={18} className="text-red-500 mr-2" />
            <Text className="font-light text-gray text-xs">No direct parent → Sub-category</Text>
          </div>
          <div className="flex items-center mt-2">
            <PiLightbulbBold size={30} className="text-[#1890ff] mr-2" />
            <Text className="font-light text-gray text-xs">
              Press Alt/Option key while dragging to duplicate an element
            </Text>
          </div>
        </div>
        <div className="flex flex-col items-center bg-white border border-[#ddd] rounded-lg text-base w-10 shadow-xl">
          <Button className="border-none bg-transparent shadow-none" icon={<LuUndo />} />
          <Button className="border-none bg-transparent shadow-none" icon={<LuRedo />} />
        </div>
      </Panel>
    </>
  );
};

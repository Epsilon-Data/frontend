import { Archetype } from '@app/api/archetypes.api';
import { useNavigate } from 'react-router-dom';
import { ArchetypeList } from '../common/ArchetypeList/ArchetypeList';

type ArchetypeProps = {
  archetypes: Archetype[];
};

export const Archetypes = ({ archetypes }: ArchetypeProps) => {
  const navigate = useNavigate();

  const handleArchetypeClick = () => {
    navigate(`/`);
  };

  return (
    <>
      <div className="column items-start mt-12">
        <ArchetypeList archetypes={archetypes} onArchetypeClick={handleArchetypeClick} />
      </div>
    </>
  );
};

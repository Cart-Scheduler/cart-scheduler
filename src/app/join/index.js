import { useParams } from 'react-router-dom';

export default function JoinProgram() {
  const { programId } = useParams();
  console.debug('Join program', programId);
  return <div>Join this here</div>;
}

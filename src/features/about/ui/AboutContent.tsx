import { Logo } from '@/components/commons/logo/Logo';

import { useAbout } from '../hooks/useAbout';

export const AboutContent = () => {
  const { version } = useAbout();

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
        <Logo color="black" />
      </div>
      <p style={{ textAlign: 'center' }}>
        <span className="heading-5">AxenAPI desktop app version {version}</span> <br />
        <br />
        <span>
          AxenAPI is a design and documentation platform for distributed systems that visualizes API specifications,
          manages service topologies, and links architecture with Markdown-based documentation in a Git-integrated
          environment.
        </span>
      </p>
    </>
  );
};

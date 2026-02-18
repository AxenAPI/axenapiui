import { useAbout } from '../hooks/useAbout';

export const AboutFooter = () => {
  const { backendVersion, buildDate, version } = useAbout();

  return (
    <p style={{ textAlign: 'center' }} className="text-sm-normal">
      Backend axenapi-web-{backendVersion} <span style={{ fontWeight: 'bold' }}>·</span> Frontend axenapi-web-{version}
      <br />
      Built on {buildDate}
    </p>
  );
};

import './styles/main.css';
import { createRoot } from 'react-dom/client';

import { SplashScreen } from '@pages/splashScreen/SplashScreen';

createRoot(document.getElementById('rootSplash')!).render(<SplashScreen />);

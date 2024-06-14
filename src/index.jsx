import React from 'react'
import { createRoot } from 'react-dom/client';

import Tournament from './Tournament';
import mockTournamentData from './Data';

const rootDiv = document.getElementById('root');
if (rootDiv !== null) {
  const root = createRoot(rootDiv);
  root.render(<Tournament tournament={mockTournamentData}/>);
}

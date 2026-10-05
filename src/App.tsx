import { AppProviders } from './app/providers'
import { MaintenancePage } from './pages/MaintenancePage'

const SITE_UNDER_MAINTENANCE = false

function App() {
  if (SITE_UNDER_MAINTENANCE) {
    return <MaintenancePage />
  }

  return <AppProviders />
}

export default App

export function CatalogState({ error, retry }: { error?: boolean; retry?: () => void }) {
  return (
    <div className="status-panel" role={error ? 'alert' : 'status'}>
      <h2>{error ? 'The lineup is temporarily unavailable.' : 'Preparing your next ride.'}</h2>
      <p>
        {error
          ? 'Please try again, or contact our team for model details.'
          : 'Loading Energion models...'}
      </p>
      {error && (
        <button className="cta" onClick={retry}>
          Try again
        </button>
      )}
    </div>
  )
}

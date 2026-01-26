import { getErrorMessage, type FallbackProps } from "react-error-boundary";

export default function Error({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: "red" }}>{getErrorMessage(error)}</pre>
            <button onClick={resetErrorBoundary}>Retry</button>
        </div>
    );
}
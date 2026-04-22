import { Component, type ErrorInfo, type ReactNode } from "react";

import { ErrorAlert } from "./ErrorAlert";

type ErrorBoundaryFallbackProps = {
	error: Error;
	resetErrorBoundary: () => void;
};

type ErrorBoundaryProps = {
	children: ReactNode;
	fallback?:
		| ReactNode
		| ((props: ErrorBoundaryFallbackProps) => ReactNode);
};

type ErrorBoundaryState = {
	hasError: boolean;
	error: Error | null;
};

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = {
		hasError: false,
		error: null,
	};

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("ErrorBoundary capturou um erro:", error, info);
	}

	private resetErrorBoundary = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		const { children, fallback } = this.props;
		const { hasError, error } = this.state;

		if (!hasError || !error) {
			return children;
		}

		if (typeof fallback === "function") {
			return fallback({
				error,
				resetErrorBoundary: this.resetErrorBoundary,
			});
		}

		if (fallback) {
			return fallback;
		}

		return (
			<div className="mx-auto my-8 w-full max-w-2xl px-4">
				<ErrorAlert
					title="Ocorreu um erro inesperado"
					message="Nao foi possivel renderizar esta tela agora."
					onRetry={this.resetErrorBoundary}
				/>
			</div>
		);
	}
}

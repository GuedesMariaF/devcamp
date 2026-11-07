const requiredEnvVars = [
	"VITE_APP_NAME",
	"VITE_API_BASE_URL",
	"VITE_API_SWAGGER_URL",
	"VITE_TOKEN_STORAGE_KEY",
	"VITE_REFRESH_TOKEN_STORAGE_KEY",
] as const;

const optionalEnvVars = ["VITE_API_WITH_CREDENTIALS"] as const;

type EnvVar = (typeof requiredEnvVars)[number];

function getEnvVar(key: EnvVar): string {
	const value = import.meta.env[key];
	if (!value) {
		console.warn(`Missing required environment variable: ${key}`);
	}
	return value;
}

function getOptionalEnvVar(
	key: (typeof optionalEnvVars)[number],
): string | undefined {
	return import.meta.env[key];
}

export const env = {
	APP_NAME: getEnvVar("VITE_APP_NAME"),
	API_BASE_URL: getEnvVar("VITE_API_BASE_URL"),
	API_SWAGGER_URL: getEnvVar("VITE_API_SWAGGER_URL"),
	TOKEN_STORAGE_KEY: getEnvVar("VITE_TOKEN_STORAGE_KEY"),
	REFRESH_TOKEN_STORAGE_KEY: getEnvVar("VITE_REFRESH_TOKEN_STORAGE_KEY"),
	API_WITH_CREDENTIALS:
		getOptionalEnvVar("VITE_API_WITH_CREDENTIALS") === "true",
} as const;

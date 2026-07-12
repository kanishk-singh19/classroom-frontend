import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
import { BACKEND_BASE_URL } from "@/constants";
import { ListResponse } from "@/types";
import { getToken } from "./auth";

// Attach the bearer token (if signed in) to every request.
const authHeaders = async () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Our backend wraps single-record responses as { data: <record> } and expects
// list queries as flat `search`/`department`/`page`/`limit` params, so we map
// refine's filters/pagination onto that shape here.

// Unwrap a { data } envelope, falling back to the raw body if absent.
const unwrap = async (response: { json: () => Promise<unknown> }) => {
  const payload = (await response.json()) as { data?: Record<string, unknown> };
  return payload?.data ?? payload;
};

// Some resources use a friendlier name in the UI than their API endpoint.
const ENDPOINTS: Record<string, string> = {
  faculty: "users",
};
const endpoint = (resource: string) => ENDPOINTS[resource] ?? resource;

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => endpoint(resource),
    buildHeaders: authHeaders,

    buildQueryParams: async ({ pagination, filters }) => {
      const query: Record<string, string | number> = {
        page: pagination?.currentPage ?? 1,
        limit: pagination?.pageSize ?? 10,
      };

      for (const filter of filters ?? []) {
        // Only flat logical filters (field/operator/value) are relevant here.
        if (!("field" in filter) || filter.value == null || filter.value === "") {
          continue;
        }
        // `name` maps to the backend's `search` param; every other field is
        // passed through as-is (department, role, status, classId, ...).
        const key = filter.field === "name" ? "search" : filter.field;
        query[key] = String(filter.value);
      }

      return query;
    },

    mapResponse: async (response) => {
      const payload: ListResponse = await response.json();
      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      const payload: ListResponse = await response.json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => `${endpoint(resource)}/${id}`,
    buildHeaders: authHeaders,
    mapResponse: async (response) => unwrap(response),
  },

  create: {
    getEndpoint: ({ resource }) => endpoint(resource),
    buildHeaders: authHeaders,
    buildBodyParams: async ({ variables }) => variables,
    mapResponse: async (response) => unwrap(response),
  },

  update: {
    getEndpoint: ({ resource, id }) => `${endpoint(resource)}/${id}`,
    buildHeaders: authHeaders,
    // Backend exposes updates as PUT, not the library default PATCH.
    getRequestMethod: () => "put",
    buildBodyParams: async ({ variables }) => variables,
    mapResponse: async (response) => unwrap(response),
  },

  deleteOne: {
    getEndpoint: ({ resource, id }) => `${endpoint(resource)}/${id}`,
    buildHeaders: authHeaders,
    mapResponse: async () => undefined,
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };

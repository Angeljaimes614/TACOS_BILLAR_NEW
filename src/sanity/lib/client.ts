import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Cliente público (perspective `published`).
 * Usa la CDN en producción para máxima velocidad.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

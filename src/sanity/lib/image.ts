import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Constructor de URLs para assets de Sanity.
 *
 * @example
 *   urlFor(product.image).width(800).height(960).url()
 */
export function urlFor(source: Image | { asset?: { _ref?: string; _id?: string } } | null | undefined) {
  if (!source) return null;
  return builder.image(source as Image).auto("format").fit("max");
}

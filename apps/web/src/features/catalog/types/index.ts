import type {
  BannersList,
  FeaturedBrandsList,
  GetAllCategoriesResponse,
} from "@qco/web-validators";

export interface CatalogData {
  categories: GetAllCategoriesResponse;
  brands: FeaturedBrandsList;
  banners: BannersList;
}

export interface CatalogDataState {
  categories: GetAllCategoriesResponse | null;
  brands: FeaturedBrandsList | null;
  banners: BannersList | null;
  isLoading: boolean;
}

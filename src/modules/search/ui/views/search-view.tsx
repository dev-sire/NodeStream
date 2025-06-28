import { CategoriesSection } from "../sections/categories-section";
import { ResultsSection } from "../sections/results-section";

interface PageProps {
	query: string | undefined;
	categoryId: string | undefined;
}

export const SearchView = ({ query, categoryId }: PageProps) => {
	return(
		<div className="max-w-[1300px] mx-auto flex flex-col mb-10 gap-y-6 px-4 pt-2.5">
			<CategoriesSection categoryId={categoryId} />
			<ResultsSection query={query} categoryId={categoryId} />
		</div>
	)
}
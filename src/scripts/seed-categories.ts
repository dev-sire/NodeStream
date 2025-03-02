// TODO: Create a script to seed categories

import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
	"Cars and Vehicles",
	"Comedy",
	"Education",
	"Gaming",
	"Entertainment",
	"Flim and Animation",
	"How-to and Style",
	"Music",
	"News and Politics",
	"People and Blogs",
	"Pets and Animals",
	"Science and Technology",
	"Sports",
	"Travels and Events"
]

async function main() {
	console.log("Seeding Categories...")
	try {
		const values = categoryNames.map((name) => ({
			name,
			description: `Videos related to ${name.toLowerCase()}`,
		}))
		await db.insert(categories).values(values);
		console.log("Categories seeded successfully!")
	} catch (error) {
		console.log("Error seeding categories: ", error);
		process.exit(1);
	}
}

main()
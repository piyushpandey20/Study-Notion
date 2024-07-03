const Category = require('../models/Category')

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res.status(401).json({
				success: false,
				message: "All fields are required",
			})
		}
		const categoryDetails = await Category.create({
			name,
			description
		})
		return res.status(200).json({
			success: true,
			message: "Category created successfully",
			categoryDetails,
		})
	}
	catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "error.message",
		})
	}
};

exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.categoryPageDetails = async (req, res) => {
	try {
		const { categoryId } = req.body;

		const selectedCategory = await Category.findById(categoryId)
			.populate("course")
			.exec();

		if (!selectedCategory) {
			console.log("Category not found.");
			return res
				.status(404)
				.json({ success: false, message: "Category not found" });
		}

		if (selectedCategory.course.length === 0) {
			console.log("No courses found for the selected category.");
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}

		const selectedCourses = selectedCategory.course;

		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId },
		}).populate("course").exec();
		let differentCourses = [];
		for (const category of categoriesExceptSelected) {
			differentCourses.push(...category.course);
		}

		// Get top-selling courses across all categories
		const allCategories = await Category.find()
		.populate({
			path:"course",
			match:{status:"Published"},
			populate:{
				path:"instructor"
			}
		});
		const allCourses = allCategories.flatMap((category) => category.course);//flatMap is used to iterate
		// over every element of allCategories array..and it flattens the resulting array into single  array
		const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold)//arranging all courses if their are sold in descending order
			.slice(0, 10);

		return res.status(200).json({
			selectedCourses: selectedCourses,
			differentCourses: differentCourses,
			mostSellingCourses: mostSellingCourses,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Error while fetching Category Page details",
			error: error.message,
		});
	}
};
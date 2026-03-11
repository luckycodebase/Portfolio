import { useEffect, useState } from "react";
import { db, collection, getDocs } from "../firebase";
import InternshipCard from "./InternshipCard";
import PropTypes from "prop-types";

const InternshipSection = ({ initialItems = 6 }) => {
	const [internships, setInternships] = useState([]);
	const [showAll, setShowAll] = useState(false);
	const isMobile = window.innerWidth < 768;
	const itemsToShow = isMobile ? 4 : initialItems;

	useEffect(() => {
		const fetchInternships = async () => {
			try {
				const internshipCollection = collection(db, "internships");
				const internshipSnapshot = await getDocs(internshipCollection);
				const internshipData = internshipSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setInternships(internshipData);
			} catch (error) {
				console.error("Error fetching internships:", error);
			}
		};
		fetchInternships();
	}, []);

	const displayedInternships = showAll ? internships : internships.slice(0, itemsToShow);

	return (
		<div className="container mx-auto flex justify-center items-center overflow-hidden">
			{/* Reserve space for internship cards to prevent layout shift */}
			<div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4 w-full min-h-[340px]">
				{displayedInternships.length > 0 ? (
					displayedInternships.map((internship, index) => (
						<div
							key={internship.id || index}
							data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
							data-aos-duration={index % 3 === 1 ? "800" : "600"}
							data-aos-delay={0}
						>
							<InternshipCard
								Img={internship.Img}
								Title={internship.Title}
								Organization={internship.Organization}
								Duration={internship.Duration}
								VerifyLink={internship.VerifyLink}
								id={internship.id}
							/>
						</div>
					))
				) : (
					// Render empty placeholders to reserve space and prevent layout shift
					Array.from({ length: itemsToShow }).map((_, idx) => (
						<div key={idx} className="opacity-0 pointer-events-none select-none">
							<div className="w-full h-[220px] bg-transparent" />
						</div>
					))
				)}
			</div>
			{internships.length > itemsToShow && (
				<div className="mt-6 w-full flex justify-start">
					<button
						onClick={() => setShowAll((prev) => !prev)}
						className="px-3 py-1.5 text-cyan-300 hover:text-white text-sm font-medium transition-all duration-300 flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 hover:border-white/20 backdrop-blur-sm group relative overflow-hidden"
					>
						<span className="relative z-10 flex items-center gap-2">
							{showAll ? "See Less" : "See More"}
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${showAll ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}>
								<polyline points={showAll ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
							</svg>
						</span>
						<span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500/50 transition-all duration-300 group-hover:w-full"></span>
					</button>
				</div>
			)}
		</div>
	);
};

InternshipSection.propTypes = {
	initialItems: PropTypes.number,
};

export default InternshipSection;

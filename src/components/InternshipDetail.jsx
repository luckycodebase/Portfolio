import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Award, Layers, Package } from "lucide-react";

import { db, collection, getDocs } from "../firebase";
import Swal from 'sweetalert2';

const SKILL_ICONS = {
  React: Package,
  Python: Package,
  JavaScript: Package,
  default: Package,
};

import PropTypes from "prop-types";

const SkillBadge = ({ skill }) => {
  SkillBadge.propTypes = {
    skill: PropTypes.string.isRequired,
  };
  const Icon = SKILL_ICONS[skill] || SKILL_ICONS["default"];
  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
        <span className="text-xs md:text-sm font-medium text-blue-300/90 group-hover:text-blue-200 transition-colors">
          {skill}
        </span>
      </div>
    </div>
  );
};

export default function InternshipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(undefined);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const internshipCollection = collection(db, "internships");
        const snapshot = await getDocs(internshipCollection);
        const found = snapshot.docs.find((doc) => doc.id === id);
        if (found) {
          setInternship({ id: found.id, ...found.data() });
        } else {
          setInternship(null);
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message });
        setInternship(null);
      }
    };
    fetchInternship();
  }, [id]);

  const handleVerifyClick = (verifyLink) => {
    if (!verifyLink) {
      Swal.fire({
        icon: 'info',
        title: 'Verification Link Not Available',
        text: 'Sorry, the verification link is not available for this internship.',
        confirmButtonText: 'Understood',
        confirmButtonColor: '#3085d6',
        background: '#030014',
        color: '#ffffff'
      });
      return false;
    }
    return true;
  };

  const handleBackClick = () => {
    navigate(-1);
  };


  if (typeof internship === 'undefined') {
    // Always reserve vertical space so footer never touches header
    return <div className="min-h-screen bg-[#030014]"></div>;
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Award className="w-16 h-16 mx-auto text-gray-500 opacity-50" />
          <p className="text-xl text-gray-400">Internship not found</p>
          <button
            onClick={handleBackClick}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030014] py-8 md:py-16 px-4 md:px-[10%]">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300 mb-8 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="font-medium">Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Internship Certificate Image */}
        <div className="lg:col-span-1" data-aos="fade-right" data-aos-duration="500">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-blue-400/20 shadow-2xl sticky top-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 z-0" />
            <img
              src={internship.Img}
              alt={internship.Title}
              className="w-full h-auto object-contain relative z-10 aspect-square"
            />
            {internship.VerifyLink && (
              <a
                href={internship.VerifyLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleVerifyClick(internship.VerifyLink)}
                className="absolute bottom-4 left-4 right-4 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 z-20 group hover:scale-105 active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Verify Credential</span>
              </a>
            )}
          </div>
        </div>

        {/* Right Side - Details */}
        <div className="lg:col-span-2 space-y-8" data-aos="fade-left" data-aos-duration="500">
          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-blue-400" />
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent">
                {internship.Title}
              </h1>
            </div>
          </div>

          {/* Organization and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {internship.Organization && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <p className="text-gray-400 text-sm mb-2">Organization</p>
                <p className="text-white font-semibold">{internship.Organization}</p>
              </div>
            )}
            {internship.Duration && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                <p className="text-gray-400 text-sm mb-2">Duration</p>
                <p className="text-white font-semibold">{internship.Duration}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {internship.Description && (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-white">About Internship</h3>
              <p className="text-gray-300 leading-relaxed">
                {internship.Description}
              </p>
            </div>
          )}

          {/* Skills */}
          {internship.Skills && internship.Skills.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Skills Gained
              </h3>
              <div className="flex flex-wrap gap-2">
                {internship.Skills.map((skill, index) => (
                  <SkillBadge key={index} skill={skill} />
                ))}
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {internship.VerifyLink && (
              <a
                href={internship.VerifyLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleVerifyClick(internship.VerifyLink)}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View full Credential</span>
              </a>
            )}
            <button
              onClick={handleBackClick}
              className="flex-1 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 border border-white/20 hover:border-white/40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

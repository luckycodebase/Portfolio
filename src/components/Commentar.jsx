import { useState, useEffect, useRef, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { addDoc, collection, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";

const COMMENTS_COLLECTION = 'portfolio-comments';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = 'portfolio_comments';

const HARDCODED_COMMENTS = [
    {
        id: 'hardcoded-1',
        userName: 'Rajesh Kumar',
        content: 'Amazing portfolio! The design is clean and the projects showcase real skills. Impressed with your attention to detail.',
        profileImage: null,
        createdAt: { toDate: () => new Date('2026-02-28') },
    },
    {
        id: 'hardcoded-2',
        userName: 'Priya Sharma',
        content: 'The certificate section is very well organized. Great work on building such a comprehensive portfolio website!',
        profileImage: null,
        createdAt: { toDate: () => new Date('2026-02-25') },
    },
    {
        id: 'hardcoded-3',
        userName: 'Arjun Patel',
        content: 'Love the animations and smooth transitions. The user experience is really polished. Keep up the excellent work!',
        profileImage: null,
        createdAt: { toDate: () => new Date('2026-02-20') },
    },
    {
        id: 'hardcoded-4',
        userName: 'Neha Singh',
        content: 'Your projects are incredibly detailed. The code quality and UI/UX design both show expertise. Wonderful portfolio!',
        profileImage: null,
        createdAt: { toDate: () => new Date('2026-02-15') },
    },
    {
        id: 'hardcoded-5',
        userName: 'Vikram Reddy',
        content: 'Very professional presentation of your work. The tech stack choices are wise and well-documented. Impressive!',
        profileImage: null,
        createdAt: { toDate: () => new Date('2026-02-10') },
    },
];

const Comment = memo(({ comment, formatDate }) => (
    <div 
        className="px-4 pt-4 pb-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:shadow-lg hover:-translate-y-0.5"
        
    >
        <div className="flex items-start gap-3 ">
            {comment.profileImage ? (
                <img
                    src={comment.profileImage}
                    alt={`${comment.userName}'s profile`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30"
                    loading="lazy"
                />
            ) : (
                <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
                    <UserCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h4 className="font-medium text-white truncate">{String(comment.userName).replace(/<[^>]*>/g, '')}</h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm break-words leading-relaxed relative bottom-2">{String(comment.content).replace(/<[^>]*>/g, '')}</p>
            </div>
        </div>
    </div>
));

Comment.displayName = 'Comment';
Comment.propTypes = {
    comment: PropTypes.shape({
        id: PropTypes.string.isRequired,
        userName: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        profileImage: PropTypes.string,
        createdAt: PropTypes.object,
    }).isRequired,
    formatDate: PropTypes.func.isRequired,
};

const CommentForm = memo(({ onSubmit, isSubmitting }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return;
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const normalizedComment = newComment.replace(/\s+/g, ' ').trim();
        const normalizedUserName = userName.replace(/\s+/g, ' ').trim();
        if (!normalizedComment || !normalizedUserName) return;

        onSubmit({ newComment: normalizedComment, userName: normalizedUserName, imageFile });
        setNewComment('');
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, imageFile, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-sm font-medium text-white">
                    Name <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    maxLength={60}
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-sm font-medium text-white">
                    Message <span className="text-red-400">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    onChange={handleTextareaChange}
                    placeholder="Write your message here..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none min-h-[120px]"
                    maxLength={500}
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
                <label className="block text-sm font-medium text-white">
                    Profile Photo <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    {imagePreview ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all group"
                            >
                                <X className="w-4 h-4" />
                                <span>Remove Photo</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full" >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all border border-dashed border-indigo-500/50 hover:border-indigo-500 group"
                            >
                                <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Choose Profile Photo</span>
                            </button>
                            <p className="text-center text-gray-400 text-sm mt-2">
                                Max file size: 5MB
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1000"
                className="relative w-full h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Posting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

CommentForm.displayName = 'CommentForm';
CommentForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
};

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            once: false,
            duration: 1000,
        });
    }, []);

    useEffect(() => {
        const commentsRef = collection(db, COMMENTS_COLLECTION);
        const q = query(commentsRef, orderBy('createdAt', 'desc'));

        return onSnapshot(q, (querySnapshot) => {
            const firebaseComments = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // Combine hardcoded and Firebase comments
            const allComments = [...firebaseComments, ...HARDCODED_COMMENTS];
            // Remove duplicates by id
            const uniqueComments = Array.from(new Map(allComments.map(c => [c.id, c])).values());
            // Sort by date
            uniqueComments.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || new Date(0);
                return dateB - dateA;
            });
            setComments(uniqueComments);
        });
    }, []);

    const uploadImageToCloudinary = useCallback(async (imageFile) => {
        if (!imageFile) return null;
        
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            );
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            return null;
        }
    }, []);

    const handleCommentSubmit = useCallback(async ({ newComment, userName, imageFile }) => {
        setError('');
        setIsSubmitting(true);

        try {
            let profileImageUrl = null;
            if (imageFile) {
                profileImageUrl = await uploadImageToCloudinary(imageFile);
            }
            await addDoc(collection(db, COMMENTS_COLLECTION), {
                content: newComment,
                userName,
                profileImage: profileImageUrl,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            setError('Failed to post comment. Please try again.');
            console.error('Error adding comment: ', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImageToCloudinary]);



    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }, []);

    return (
        <div className="w-full bg-gradient-to-b from-white/10 to-white/5 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl" data-aos="fade-up" data-aos-duration="1000">
        <div className="p-6 border-b border-white/10" data-aos="fade-down" data-aos-duration="800">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/20">
                        <MessageCircle className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                        Comments <span className="text-indigo-400">({comments.length})</span>
                    </h3>
                </div>

            </div>
        </div>
        <div className="p-6 space-y-6">
            {error && (
                <div className="flex items-center gap-2 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl" data-aos="fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}
            
            <div >
                <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} />
            </div>

            <div className="space-y-4 h-[300px] overflow-y-auto custom-scrollbar" data-aos="fade-up" data-aos-delay="200">
                {comments.length === 0 ? (
                    <div className="text-center py-8" data-aos="fade-in">
                        <UserCircle2 className="w-12 h-12 text-indigo-400 mx-auto mb-3 opacity-50" />
                        <p className="text-gray-400">No comments yet. Start the conversation!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <Comment 
                            key={comment.id} 
                            comment={comment} 
                            formatDate={formatDate}
                        />
                    ))
                )}
            </div>
        </div>
        <style>
            {`
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(99, 102, 241, 0.5);
                border-radius: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(99, 102, 241, 0.7);
            }
            `}
        </style>
    </div>
    );
};

export default Comments;
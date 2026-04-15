import React, { useState } from 'react';
import { FiMail, FiArrowRight, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

const NewsletterCTA = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Step 1: Basic email validation
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address.');
            return;
        }
        setLoading(true);
        await new Promise(r => setTimeout(r, 800)); // Simulate network request delay
        
        setSubmitted(true);
        setLoading(false);
        toast.success('You\'re on the list! 🎉');
    };

    return (
        <section className="w-full py-16 sm:py-24 px-6 sm:px-12 bg-[#f8faf2] dark:bg-gray-900 overflow-hidden">
            <div className="max-w-[900px] mx-auto">
                <div className="relative rounded-[40px] overflow-hidden shadow-2xl shadow-[#8cc63f]/10 border border-[#8cc63f]/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#edfad8] via-[#f4fce8] to-[#fffef5]" />

                    {/* ── Decorative blobs ── */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#8cc63f]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-[#fbc111]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-white/ dark:bg-gray-800/ blur-2xl rounded-full pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 p-8 sm:p-12 lg:p-14">

                        {/* ── Left: Icon Cluster ── */}
                        <div className="flex-shrink-0 relative w-28 h-28 sm:w-36 sm:h-36">
                            {/* Central icon */}
                            <div className="absolute inset-0 rounded-[28px] bg-[#8cc63f] flex items-center justify-center shadow-xl shadow-[#8cc63f]/30 rotate-3">
                                <FiMail size={42} className="text-white" />
                            </div>
                            {/* Floating badge 1 */}
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#fbc111] rounded-2xl flex items-center justify-center shadow-lg shadow-[#fbc111]/30 -rotate-6">
                                <span className="text-white text-base">🏆</span>
                            </div>
                            {/* Floating badge 2 */}
                            <div className="absolute -bottom-2 -left-3 w-9 h-9 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-md rotate-6 border border-[#8cc63f]/20">
                                <span className="text-base">🚀</span>
                            </div>
                        </div>

                        {/* ── Right: Text + Form ── */}
                        <div className="flex-1 text-center lg:text-left w-full">
                            {/* Eyebrow */}
                            <div className="inline-flex items-center gap-2 bg-white/ dark:bg-gray-800/ border border-[#8cc63f]/20 rounded-full px-4 py-1.5 mb-4 shadow-sm backdrop-blur-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#8cc63f] animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#5c8a14]">Stay Updated</span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-gray-100 tracking-tighter leading-tight mb-3">
                                Ready to Showcase Your{' '}
                                <span className="text-[#8cc63f]">Brilliance?</span>
                            </h2>
                            <p className="text-gray-500 text-sm sm:text-base font-semibold mb-7 max-w-md mx-auto lg:mx-0 leading-relaxed">
                                Join the Desun ecosystem — get notified about new contests, deadlines, and winner announcements straight to your inbox.
                            </p>

                            {submitted ? (
                                /* Success State */
                                <div className="flex items-center justify-center lg:justify-start gap-3 bg-[#8cc63f]/10 border border-[#8cc63f]/30 rounded-2xl px-6 py-4 w-fit mx-auto lg:mx-0">
                                    <div className="w-9 h-9 rounded-xl bg-[#8cc63f] flex items-center justify-center flex-shrink-0">
                                        <FiCheck size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-[#3d6b10] leading-none">You're on the list!</p>
                                        <p className="text-[11px] text-[#5c8a14] font-semibold mt-0.5">Watch your inbox for updates 🎉</p>
                                    </div>
                                </div>
                            ) : (
                                /* Form */
                                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full mx-auto lg:mx-0">
                                    <div className="relative flex-1">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Enter your email address"
                                            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-800 border-2 border-transparent focus:border-[#8cc63f]/40 outline-none text-sm font-semibold text-slate-700 placeholder:text-gray-300 shadow-sm transition-all"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center justify-center gap-2 px-7 py-4 bg-[#8cc63f] hover:bg-[#7eb533] active:scale-95 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-lg shadow-[#8cc63f]/30 transition-all disabled:opacity-60 whitespace-nowrap border-b-4 border-[#5c8a14]/40"
                                    >
                                        {loading ? (
                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Start Your Journey
                                                <FiArrowRight size={14} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}

                            {/* Trust line */}
                            {!submitted && (
                                <p className="text-[10px] text-gray-400 font-semibold mt-3 flex items-center justify-center lg:justify-start gap-1.5">
                                    <FiCheck size={10} className="text-[#8cc63f]" />
                                    No spam. Unsubscribe anytime.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterCTA;

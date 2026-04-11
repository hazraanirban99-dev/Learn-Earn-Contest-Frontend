// ============================================================
// ResetPassword.jsx — Password recovery page
// Forgot password link theke email verification code validation handle kore.
// New password set korar options r success alerts ekhane implement kora.
// ============================================================

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar, Footer, InputField, Button, Logo } from '../../components';
import { FiLock, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import PageTransition from '../../components/Common/PageTransition';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const response = await api.put(`/users/password/reset/${token}`, {
                password, 
                confirmPassword 
            });

            if (response.data.success) {
                toast.success("Password reset successfully!");
                navigate('/login');
            } else {
                toast.error(response.data.message || "Failed to reset password.");
            }
        } catch (error) {
            console.error("Reset Password Error:", error);
            toast.error(error.message || "Server connection failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-linear-to-r from-[#fbc111] to-[#8cc63f] overflow-x-hidden">
            <Navbar />
            <PageTransition>
                <main className="flex-1 flex items-center justify-center pt-24 px-4 py-6 md:py-10 lg:py-14">
                <div className="w-full max-w-[1000px] flex flex-col lg:flex-row bg-white font-sans text-gray-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                    
                    {/* Left Panel - Branding */}
                    <div className="flex flex-1 bg-linear-to-br from-[#f0f9e1] via-[#f7fcea] to-white p-8 md:p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border-48 border-[#8cc63f]/5"></div>
                        
                        <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
                            <div className="text-[#fbc111] font-bold text-lg tracking-tight mb-8 lg:mb-12 uppercase">Desun Academy</div>
                            <h1 className="text-[32px] md:text-[40px] lg:text-[48px] font-black leading-[1.05] tracking-tight text-black max-w-md">
                                Secure Your <br />
                                <span className="text-[#8cc63f]">Mastery</span>
                            </h1>
                            <p className="text-gray-600 text-[14px] mt-4 max-w-sm leading-relaxed font-semibold opacity-90">
                                Your security is our priority. Please create a strong new password for your account.
                            </p>
                        </div>
                    </div>

                    {/* Right Panel - Form */}
                    <div className="flex-1 p-6 md:p-12 lg:p-16 flex flex-col items-center justify-center bg-white">
                        <div className="w-full max-w-[380px]">
                            <div className="flex flex-col items-center mb-10">
                                <Logo size="lg" className="mb-8" />
                                <div className="text-center">
                                    <h2 className="font-black text-black mb-1.5 tracking-tight leading-tight uppercase text-[28px]">
                                        Set New Password
                                    </h2>
                                    <p className="text-gray-500 text-[14px] font-bold opacity-70">
                                        Enter your new credentials below.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <InputField
                                    label="New Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    icon={FiLock}
                                    required
                                />
                                <InputField
                                    label="Confirm Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    icon={FiLock}
                                    required
                                />

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    text={loading ? "Updating..." : "Reset Password"}
                                    icon={FiArrowRight}
                                    variant="primary"
                                    className="mt-2 py-4 shadow-xl shadow-[#8cc63f]/25 text-[16px] tracking-wider"
                                />
                            </form>
                        </div>
                    </div>
                </div>
                </main>
            </PageTransition>
            
            <Footer />
        </div>
    );
};

export default ResetPassword;

import React from 'react';
import Link from 'next/link';

const HomePage = () => {
	return (
		<div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-white flex items-center justify-center px-4">
			<div className="max-w-3xl w-full bg-white rounded-2xl shadow-healthcare p-8 md:p-12 text-center">
				<div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-gradient-to-br from-healthcare-400 to-healthcare-600 flex items-center justify-center text-white text-2xl">
					💊
				</div>
				<h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">HealthAI Platform</h1>
				<p className="text-gray-600 text-lg mb-8">
					Intelligent healthcare assistant with appointments, medicines, health metrics, and conversational AI support.
				</p>
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<Link href="/login" className="px-6 py-3 rounded-lg bg-healthcare-600 text-white font-semibold hover:bg-healthcare-700 transition-colors">
						Login
					</Link>
					<Link href="/register" className="px-6 py-3 rounded-lg border border-healthcare-600 text-healthcare-700 font-semibold hover:bg-healthcare-50 transition-colors">
						Create Account
					</Link>
				</div>
			</div>
		</div>
	);
};

export default HomePage;

import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="relative w-full max-w-sm mx-auto">
            <div className="relative bg-slate-900 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Header Skeleton */}
                <div className="p-4 flex justify-between items-center bg-white/5 border-b border-white/5">
                    <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
                </div>

                {/* Image Skeleton */}
                <div className="aspect-square w-full bg-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-slate-700 border-t-base-blue rounded-full animate-spin" />
                    </div>
                </div>

                {/* Data Skeleton */}
                <div className="p-4 space-y-4 bg-slate-900/90">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-white/5 h-16 animate-pulse" />
                        <div className="bg-slate-800/50 p-3 rounded-lg border border-white/5 h-16 animate-pulse" />
                    </div>
                    <div className="h-4 w-48 bg-slate-800 rounded mx-auto animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;

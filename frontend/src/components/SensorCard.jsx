import React from 'react';
import { motion } from 'framer-motion';

const SensorCard = ({ title, value, unit, icon: Icon, color, trend }) => {
    // Map text color classes to bg classes for the bloom effect and icon background
    const getBgColor = (textClass) => {
        return textClass.replace('text-', 'bg-');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`relative overflow-hidden bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors duration-300`}
        >
            <div className={`absolute top-0 right-0 p-4 opacity-5 dark:opacity-10`}>
                <Icon size={120} className={color} />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2.5 rounded-xl ${getBgColor(color)}/10 dark:bg-slate-900/50`}>
                        <Icon size={24} className={color} />
                    </div>
                    <h3 className="text-slate-500 dark:text-slate-400 font-semibold text-sm uppercase tracking-wider">{title}</h3>
                </div>

                <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight">{value}</span>
                    <span className="text-xl text-slate-400 dark:text-slate-500 font-medium mb-1">{unit}</span>
                </div>

                {trend && (
                    <div className="mt-4 flex items-center text-sm font-medium">
                        <span className={trend > 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}>
                            {trend > 0 ? '+' : ''}{trend}%
                        </span>
                        <span className="text-slate-400 ml-2">vs last hour</span>
                    </div>
                )}
            </div>

            {/* Decorative gradient bloom */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30 dark:opacity-20 ${getBgColor(color)}`}></div>
        </motion.div>
    );
};

export default SensorCard;

// "use client";
// import CalendarHeatmap from 'react-calendar-heatmap';
// import { format, subDays } from 'date-fns';

// export default function HabitHeatmap() {
//   // Data dummy (nantinya diambil dari database berdasarkan history penyelesaian habit)
//   const today = new Date();
//   const data = [
//     { date: format(subDays(today, 1), 'yyyy-MM-dd'), count: 2 },
//     { date: format(subDays(today, 3), 'yyyy-MM-dd'), count: 4 },
//     { date: format(today, 'yyyy-MM-dd'), count: 5 },
//   ];

//   return (
//     <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
//       <h3 className="text-lg font-semibold mb-4">Habit Consistency</h3>
//       <div className="heatmap-container text-xs">
//         <CalendarHeatmap
//           startDate={subDays(today, 90)} // Lihat 3 bulan terakhir
//           endDate={today}
//           values={data}
//           classForValue={(value) => {
//             if (!value) return 'fill-slate-800';
//             if (value.count >= 4) return 'fill-green-400';
//             if (value.count >= 2) return 'fill-green-600';
//             return 'fill-green-800';
//           }}
//         />
//       </div>
//       <div className="flex gap-2 text-[10px] mt-2 text-slate-500 justify-end items-center">
//         <span>Less</span>
//         <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
//         <div className="w-3 h-3 bg-green-800 rounded-sm"></div>
//         <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
//         <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
//         <span>More</span>
//       </div>
//     </div>
//   );
// }
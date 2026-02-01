// // client/src/app/(dashboard)/student-dashboard/attendance/components/QrScannerModal.tsx
// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { IoClose, IoCamera, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
// import { AiOutlineLoading3Quarters } from 'react-icons/ai';
// import { attendanceAPI } from '../../../../../../lib/attendance';
// import { Html5QrcodeScanner } from 'html5-qrcode';
// import toast from 'react-hot-toast';

// interface QrScannerModalProps {
//   courseId: string;
//   courseName: string;
//   courseCode: string;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function QrScannerModal({
//   courseId,
//   courseName,
//   courseCode,
//   onClose,
//   onSuccess,
// }: QrScannerModalProps) {
//   const scannerRef = useRef<Html5QrcodeScanner | null>(null);
//   const [processing, setProcessing] = useState(false);
//   const [scanning, setScanning] = useState(false);

//   useEffect(() => {
//     initScanner();

//     return () => {
//       if (scannerRef.current) {
//         scannerRef.current.clear().catch(console.error);
//       }
//     };
//   }, []);

//   const initScanner = async () => {
//     try {
//       const html5QrCode = new Html5QrcodeScanner(
//         'qr-reader',
//         { 
//           qrbox: { width: 250, height: 250 },
//           fps: 5,
//           formatsToSupport: ['QR_CODE'],
//           aspectRatio: 1.0,
//           disableFlip: false,
//           rememberLastUsedCamera: true,
//         },
//         false
//       );

//       html5QrCode.render(onScanSuccess, (error) => {
//         // Silent - continuous scan
//         console.log('QR scan:', error);
//       });

//       scannerRef.current = html5QrCode;
//       setScanning(true);
      
//       toast('📱 Camera ready - scan QR code', {
//         duration: 2000,
//         position: 'top-center',
//       });
//     } catch (error) {
//       toast.error('❌ Camera access denied', {
//         duration: 4000,
//       });
//       console.error('Scanner init failed:', error);
//     }
//   };

//   const onScanSuccess = async (decodedText: string) => {
//     if (processing) return;

//     try {
//       setProcessing(true);
      
//       toast.loading('⏳ Marking attendance...', { 
//         id: 'attendance-mark',
//         duration: Infinity,
//       });

//       // Get geolocation (optional)
//       let latitude: number | undefined;
//       let longitude: number | undefined;
      
//       if (navigator.geolocation) {
//         try {
//           const position = await new Promise<GeolocationPosition>((resolve, reject) => {
//             navigator.geolocation.getCurrentPosition(resolve, reject, {
//               enableHighAccuracy: true,
//               timeout: 3000,
//             });
//           });
//           latitude = position.coords.latitude;
//           longitude = position.coords.longitude;
//         } catch (geoErr) {
//           console.warn('Geolocation unavailable:', geoErr);
//         }
//       }

//       // Mark attendance
//       const response = await attendanceAPI.markAttendance({
//         qrCode: decodedText,
//         latitude,
//         longitude,
//       });

//       // Success - Green toast
//       toast.success('✅ Attendance marked successfully!', {
//         id: 'attendance-mark',
//         duration: 3000,
//       });

//       // Auto-close and refresh
//       setTimeout(() => {
//         onSuccess();
//       }, 1500);

//     } catch (error: any) {
//       // Error - Red toast
//       const errorMsg = error.response?.data?.message || 
//                       error.message ||
//                       'Failed to mark attendance. Try again.';
      
//       toast.error(`❌ ${errorMsg}`, {
//         id: 'attendance-mark',
//         duration: 5000,
//       });

//       console.error('Attendance mark failed:', error);
      
//       // Restart scanner after 2s
//       setTimeout(() => {
//         setProcessing(false);
//         if (scannerRef.current) {
//           scannerRef.current.clear().catch(console.error);
//           initScanner();
//         }
//       }, 2000);
//     }
//   };

//   const handleClose = () => {
//     if (scannerRef.current) {
//       scannerRef.current.clear().catch(console.error);
//     }
//     toast.dismiss('attendance-mark');
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border-4 border-white/20">
//         {/* Header */}
//         <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
//                 <IoCamera className="w-6 h-6" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold">Scan QR Code</h2>
//                 <p className="text-sm text-white/80">{courseName}</p>
//                 <p className="text-xs text-white/60 font-mono">{courseCode}</p>
//               </div>
//             </div>
            
//             <button
//               onClick={handleClose}
//               disabled={processing}
//               className="p-2 hover:bg-white/20 rounded-xl transition-all"
//             >
//               <IoClose className="w-7 h-7" />
//             </button>
//           </div>
//         </div>

//         {/* Scanner Area */}
//         <div className="p-6 bg-gray-50">
//           <div 
//             id="qr-reader" 
//             className="w-full rounded-xl overflow-hidden shadow-xl border-4 border-gray-300"
//           />

//           {/* Processing Overlay */}
//           {processing && (
//             <div className="mt-6 bg-blue-500 text-white p-4 rounded-xl text-center">
//               <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin mx-auto mb-2" />
//               <p className="font-bold">Marking Attendance...</p>
//             </div>
//           )}

//           {/* Instructions */}
//           {!processing && (
//             <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
//               <div className="flex items-start gap-3">
//                 <IoCamera className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
//                 <div className="text-sm text-blue-900">
//                   <p className="font-bold mb-2">📸 How to Scan:</p>
//                   <ul className="space-y-1 text-xs">
//                     <li>✓ Allow camera access when prompted</li>
//                     <li>✓ Point camera at teacher's QR code</li>
//                     <li>✓ Hold steady until scanned</li>
//                     <li>✓ Wait for confirmation</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="p-4 bg-gray-100 border-t-2 border-gray-200">
//           <button
//             onClick={handleClose}
//             disabled={processing}
//             className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }





// client/src/app/(dashboard)/student-dashboard/attendance/components/QrScannerModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { IoClose, IoCamera } from 'react-icons/io5';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { attendanceAPI } from '../../../../../../lib/attendance';
import { Html5QrcodeScanner } from 'html5-qrcode';
import toast from 'react-hot-toast';

interface QrScannerModalProps {
  courseId: string;
  courseName: string;
  courseCode: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function QrScannerModal({
  courseId,
  courseName,
  courseCode,
  onClose,
  onSuccess,
}: QrScannerModalProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    initScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const initScanner = async () => {
    try {
      const html5QrCode = new Html5QrcodeScanner(
        'qr-reader',
        {
          qrbox: { width: 250, height: 250 },
          fps: 5,
          aspectRatio: 1.0,
          disableFlip: false,
          rememberLastUsedCamera: true,
        },
        false
      );

      html5QrCode.render(onScanSuccess, () => {});
      scannerRef.current = html5QrCode;

      toast('Camera ready. Scan the QR code', {
        duration: 2000,
        position: 'top-center',
      });
    } catch (error) {
      toast.error('Camera access denied');
      console.error('Scanner init failed:', error);
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    if (processing) return;

    try {
      setProcessing(true);

      toast.loading('Marking attendance...', {
        id: 'attendance-mark',
        duration: Infinity,
      });

      let latitude: number | undefined;
      let longitude: number | undefined;

      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 3000,
            });
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch (geoErr) {
          console.warn('Geolocation unavailable:', geoErr);
        }
      }

      await attendanceAPI.mark({
        qrCode: decodedText,
        latitude,
        longitude,
      });

      toast.success('Attendance marked successfully', {
        id: 'attendance-mark',
        duration: 3000,
      });

      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || error?.message || 'Failed to mark attendance';

      toast.error(errorMsg, {
        id: 'attendance-mark',
        duration: 5000,
      });

      console.error('Attendance mark failed:', error);

      setTimeout(() => {
        setProcessing(false);
        if (scannerRef.current) {
          scannerRef.current.clear().catch(console.error);
          initScanner();
        }
      }, 1500);
    }
  };

  const handleClose = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }
    toast.dismiss('attendance-mark');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border-4 border-white/20">
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <IoCamera className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Scan QR Code</h2>
                <p className="text-sm text-white/80">{courseName}</p>
                <p className="text-xs text-white/60 font-mono">{courseCode}</p>
              </div>
            </div>

            <button
              onClick={handleClose}
              disabled={processing}
              className="p-2 hover:bg-white/20 rounded-xl transition-all"
            >
              <IoClose className="w-7 h-7" />
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <div
            id="qr-reader"
            className="w-full rounded-xl overflow-hidden shadow-xl border-4 border-gray-300"
          />

          {processing && (
            <div className="mt-6 bg-blue-500 text-white p-4 rounded-xl text-center">
              <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p className="font-bold">Marking Attendance</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-100 border-t-2 border-gray-200">
          <button
            onClick={handleClose}
            disabled={processing}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

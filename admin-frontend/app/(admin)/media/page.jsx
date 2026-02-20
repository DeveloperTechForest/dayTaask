// app/media/page.jsx
"use client";

import { useState } from "react";
import {
  Search,
  Download,
  Trash2,
  Flag,
  Image,
  FileAudio,
  FileVideo,
  File,
  HardDrive,
  Clock,
  Upload,
  Package,
  X,
  ChevronDown,
} from "lucide-react";

const mockMedia = [
  {
    id: "M-001",
    name: "before_kitchen.jpg",
    bookingId: "BK-1234",
    type: "image",
    uploadedBy: { name: "Vikram Singh", role: "Taaskr" },
    uploadedAt: "2024-01-15 10:30",
    size: "2.4 MB",
    tags: ["before", "kitchen"],
    isEvidence: false,
    flagged: false,
    url: "",
  },
  {
    id: "M-002",
    name: "after_kitchen.jpg",
    bookingId: "BK-1234",
    type: "image",
    uploadedBy: { name: "Vikram Singh", role: "Taaskr" },
    uploadedAt: "2024-01-15 14:30",
    size: "2.8 MB",
    tags: ["after", "kitchen"],
    isEvidence: true,
    flagged: false,
    url: "",
  },
  {
    id: "M-003",
    name: "customer_approval.mp3",
    bookingId: "BK-1234",
    type: "audio",
    uploadedBy: { name: "Rahul Sharma", role: "Customer" },
    uploadedAt: "2024-01-15 14:35",
    size: "1.2 MB",
    tags: ["approval", "voice"],
    isEvidence: true,
    flagged: false,
    url: "",
  },
  {
    id: "M-004",
    name: "damage_report.jpg",
    bookingId: "BK-1235",
    type: "image",
    uploadedBy: { name: "Priya Patel", role: "Customer" },
    uploadedAt: "2024-01-14 09:00",
    size: "3.1 MB",
    tags: ["damage", "dispute"],
    isEvidence: true,
    flagged: true,
    url: "",
  },
  {
    id: "M-005",
    name: "work_progress.mp4",
    bookingId: "BK-1236",
    type: "video",
    uploadedBy: { name: "Amit Kumar", role: "Taaskr" },
    uploadedAt: "2024-01-13 16:20",
    size: "45.2 MB",
    tags: ["progress", "video"],
    isEvidence: false,
    flagged: false,
    url: "",
  },
  {
    id: "M-006",
    name: "invoice_receipt.pdf",
    bookingId: "BK-1237",
    type: "document",
    uploadedBy: { name: "System", role: "Auto" },
    uploadedAt: "2024-01-12 11:00",
    size: "0.5 MB",
    tags: ["invoice", "receipt"],
    isEvidence: false,
    flagged: false,
    url: "",
  },
];

const storageInfo = {
  used: 12.5,
  total: 50,
  retention: "90 days",
  lastPurge: "2024-01-01",
};

export default function MediaLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <Image className="h-8 w-8 text-blue-500" />;
      case "audio":
        return <FileAudio className="h-8 w-8 text-purple-500" />;
      case "video":
        return <FileVideo className="h-8 w-8 text-red-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const toggleSelect = (id) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedFiles.length === filteredMedia.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredMedia.map((f) => f.id));
    }
  };

  const filteredMedia = mockMedia.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesType = typeFilter === "all" || file.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Media & Evidence
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage uploaded media files and evidence
          </p>
        </div>
      </div>

      {/* Storage Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <HardDrive className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600">Storage Used</p>
              <p className="text-lg font-semibold">
                {storageInfo.used} GB / {storageInfo.total} GB
              </p>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                <div
                  className="bg-orange-500 h-1.5 rounded-full"
                  style={{
                    width: `${(storageInfo.used / storageInfo.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Retention Policy</p>
              <p className="text-lg font-semibold">{storageInfo.retention}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Package className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Files</p>
              <p className="text-lg font-semibold">{mockMedia.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Flag className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Flagged Files</p>
              <p className="text-lg font-semibold">
                {mockMedia.filter((f) => f.flagged).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-5 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-4 z-10 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by filename, booking ID, tags..."
                className="w-full h-12 pl-12 pr-5 rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
              />
            </div>

            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none px-4 py-3 pr-10 border border-slate-300 rounded-xl bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer w-[150px]"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
                <option value="document">Documents</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl transition font-medium">
              <Upload className="w-4 h-4" />
              Upload
            </button>
            {selectedFiles.length > 0 && (
              <>
                <button className="flex items-center gap-2 px-4 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl transition font-medium">
                  <Download className="w-4 h-4" />
                  Export ({selectedFiles.length})
                </button>
                <button className="flex items-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition font-medium">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Select All */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={
            selectedFiles.length === filteredMedia.length &&
            filteredMedia.length > 0
          }
          onChange={selectAll}
          className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
        />
        <span className="text-sm text-slate-600">
          Select all ({filteredMedia.length} files)
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((file) => (
          <div
            key={file.id}
            className={`bg-white rounded-2xl shadow-sm border border-slate-200 hover:ring-2 hover:ring-orange-500/50 transition-all cursor-pointer ${
              selectedFiles.includes(file.id) ? "ring-2 ring-orange-500" : ""
            }`}
          >
            <div className="p-3">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => toggleSelect(file.id)}
                  className="absolute top-0 left-0 z-10 h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                {file.flagged && (
                  <Flag className="absolute top-0 right-0 h-4 w-4 text-red-500" />
                )}
                <div
                  className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center mb-2"
                  onClick={() => {
                    setPreviewFile(file);
                    setPreviewOpen(true);
                  }}
                >
                  {getFileIcon(file.type)}
                </div>
              </div>
              <p className="text-sm font-medium truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-slate-500">{file.bookingId}</p>
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                {file.isEvidence && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    Evidence
                  </span>
                )}
                <span className="text-xs text-slate-500">{file.size}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewOpen && previewFile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                {previewFile.name}
              </h2>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                {previewFile.type === "image" && (
                  <Image className="h-24 w-24 text-slate-500" />
                )}
                {previewFile.type === "audio" && (
                  <div className="text-center">
                    <FileAudio className="h-24 w-24 text-slate-500 mx-auto" />
                    <p className="mt-2 text-sm text-slate-500">
                      Audio Player Placeholder
                    </p>
                  </div>
                )}
                {previewFile.type === "video" && (
                  <FileVideo className="h-24 w-24 text-slate-500" />
                )}
                {previewFile.type === "document" && (
                  <File className="h-24 w-24 text-slate-500" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Booking ID:</span>{" "}
                  {previewFile.bookingId}
                </div>
                <div>
                  <span className="text-slate-600">Size:</span>{" "}
                  {previewFile.size}
                </div>
                <div>
                  <span className="text-slate-600">Uploaded By:</span>{" "}
                  {previewFile.uploadedBy.name} ({previewFile.uploadedBy.role})
                </div>
                <div>
                  <span className="text-slate-600">Uploaded At:</span>{" "}
                  {previewFile.uploadedAt}
                </div>
                <div className="col-span-2">
                  <span className="text-slate-600">Tags:</span>{" "}
                  {previewFile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 mr-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button className="px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition">
                {previewFile.isEvidence
                  ? "Remove Evidence"
                  : "Mark as Evidence"}
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition">
                <Flag className="w-4 h-4" />
                Flag
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-slate-300 hover:bg-slate-50 rounded-xl font-medium transition">
                <Download className="w-4 h-4" />
                Download
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

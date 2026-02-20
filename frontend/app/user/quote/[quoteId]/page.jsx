// app/quote/[quoteId]/page.jsx
"use client";

import Header from "@/components/Header";
import { useParams, useRouter } from "next/navigation";
import { Clock, MessageSquare, FileText, CheckCircle2 } from "lucide-react";

export default function QuoteDetails() {
  const { quoteId } = useParams();
  const router = useRouter();

  // Mock Data (same as your original)
  const quote = {
    id: quoteId,
    status: "responded",
    createdAt: "2024-01-15",
    problemDescription:
      "Need complete rewiring of a 3BHK apartment including new switchboard and electrical safety upgrades",
    preferredDate: "2024-02-01",
    preferredTime: "Morning",
    images: [
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&h=200&fit=crop",
    ],
    expertResponses: [
      {
        id: 1,
        expertName: "Rajesh Kumar",
        expertRating: 4.9,
        expertImage: "https://i.pravatar.cc/150?img=12",
        estimatedPrice: 18500,
        estimatedDuration: "3-4 days",
        message:
          "I've reviewed your requirements. I can provide a complete rewiring solution with premium quality materials and 2-year warranty.",
        responseDate: "2024-01-16",
      },
      {
        id: 2,
        expertName: "Amit Shah",
        expertRating: 4.7,
        expertImage: "https://i.pravatar.cc/150?img=13",
        estimatedPrice: 16800,
        estimatedDuration: "4-5 days",
        message:
          "I specialize in residential rewiring. Can provide detailed breakdown and quality assurance.",
        responseDate: "2024-01-16",
      },
    ],
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            Pending
          </span>
        );
      case "responded":
        return (
          <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            Responses Received
          </span>
        );
      case "accepted":
        return (
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
              Quote #{quote.id}
            </h1>
            {getStatusBadge(quote.status)}
          </div>
          <p className="text-muted-foreground mt-2">
            Submitted on {quote.createdAt}
          </p>
        </div>

        {/* Your Original Request */}
        <div className="bg-card rounded-2xl border border-border shadow-lg p-8 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-foreground">Your Request</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Problem Description
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {quote.problemDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Preferred Date
                </h3>
                <p className="text-muted-foreground">{quote.preferredDate}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Preferred Time
                </h3>
                <p className="text-muted-foreground">{quote.preferredTime}</p>
              </div>
            </div>

            {quote.images.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Attached Images
                </h3>
                <div className="flex flex-wrap gap-4">
                  {quote.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Attachment ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded-xl border border-border shadow-md hover:scale-105 transition-transform"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expert Responses */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
            Expert Responses ({quote.expertResponses.length})
          </h2>

          {quote.expertResponses.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-16 text-center">
              <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                Waiting for Expert Responses
              </h3>
              <p className="text-muted-foreground">
                Experts will review your request and provide quotes within 24
                hours
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {quote.expertResponses.map((response) => (
                <div
                  key={response.id}
                  className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden"
                >
                  <div className="p-6 sm:p-8">
                    {/* Expert Info */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500/20">
                          <img
                            src={response.expertImage}
                            alt={response.expertName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            {response.expertName}
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="text-yellow-500 font-medium bg-yellow-100/50 px-2 py-1 rounded-full">
                              {response.expertRating} ★
                            </span>
                            <span>•</span>
                            <span>{response.responseDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quote Details */}
                    <div className="bg-muted/50 rounded-xl p-6 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Estimated Price
                          </p>
                          <p className="text-3xl font-bold text-yellow-500">
                            ₹{response.estimatedPrice.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Duration
                          </p>
                          <p className="text-xl font-semibold flex items-center gap-2">
                            <Clock className="w-5 h-5 text-yellow-500" />
                            {response.estimatedDuration}
                          </p>
                        </div>
                      </div>

                      <hr className="border-border my-5" />

                      <div>
                        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5" />
                          Message from Expert
                        </p>
                        <p className="text-foreground leading-relaxed">
                          {response.message}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() =>
                          router.push(`/user/quote/${quote.id}/${response.id}`)
                        }
                        className="flex-1 bg-yellow-500 text-white font-bold py-4 rounded-xl hover:bg-yellow-600/80 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Accept & Book
                      </button>
                      <button className="flex-1 border-2 border-yellow-500 text-yellow-500 font-bold py-4 rounded-xl hover:bg-yellow-500 hover:text-white transition-all flex items-center justify-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Chat with Expert
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// src/pages/admin/ReviewModeration.tsx

import React, { useState, useEffect } from 'react';
import { Search, Star, Check, X, Eye } from 'lucide-react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { useModal } from '../../hooks/useModal';
import { formatDate } from '../../utils/format';
import toast from 'react-hot-toast';

const ReviewModeration: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const { isOpen, open, close } = useModal();

  // Mock data
  useEffect(() => {
    setReviews([
      {
        id: 1,
        user: { first_name: 'John', last_name: 'Doe' },
        hotel: { name: 'Grand Plaza Hotel' },
        rating: 5,
        comment: 'Excellent service and comfortable rooms! Would definitely recommend.',
        is_approved: false,
        created_at: '2024-11-20',
      },
      {
        id: 2,
        user: { first_name: 'Jane', last_name: 'Smith' },
        hotel: { name: 'Oceanview Resort' },
        rating: 4,
        comment: 'Beautiful location with great amenities. Staff was very helpful.',
        is_approved: true,
        created_at: '2024-11-19',
      },
      {
        id: 3,
        user: { first_name: 'Mike', last_name: 'Johnson' },
        hotel: { name: 'Mountain Lodge' },
        rating: 5,
        comment: 'Perfect getaway destination! Clean rooms and amazing views.',
        is_approved: false,
        created_at: '2024-11-21',
      },
    ]);
  }, []);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.hotel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'approved' && review.is_approved) ||
      (statusFilter === 'pending' && !review.is_approved);
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (reviewId: number) => {
    try {
      setReviews(
        reviews.map((r) => (r.id === reviewId ? { ...r, is_approved: true } : r))
      );
      toast.success('Review approved successfully');
    } catch (err) {
      toast.error('Failed to approve review');
    }
  };

  const handleReject = async (reviewId: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        setReviews(reviews.filter((r) => r.id !== reviewId));
        toast.success('Review deleted successfully');
      } catch (err) {
        toast.error('Failed to delete review');
      }
    }
  };

  const handleViewDetails = (review: any) => {
    setSelectedReview(review);
    open();
  };

  const pendingCount = reviews.filter((r) => !r.is_approved).length;
  const approvedCount = reviews.filter((r) => r.is_approved).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Moderation</h1>
        <p className="text-gray-600">Approve or reject customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
          <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Pending Review</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest name or hotel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Reviews</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {review.user.first_name} {review.user.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{review.hotel.name}</p>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <Badge variant={review.is_approved ? 'success' : 'warning'}>
                    {review.is_approved ? 'Approved' : 'Pending'}
                  </Badge>
                </div>

                <p className="text-gray-700 mb-3">{review.comment}</p>

                <p className="text-sm text-gray-500">
                  Submitted on {formatDate(review.created_at)}
                </p>
              </div>

              <div className="flex flex-col space-y-2 ml-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDetails(review)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                {!review.is_approved && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(review.id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(review.id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                {review.is_approved && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(review.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Review Detail Modal */}
      <Modal isOpen={isOpen} onClose={close} title="Review Details" size="lg">
        {selectedReview && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Guest</p>
              <p className="font-semibold text-gray-900">
                {selectedReview.user.first_name} {selectedReview.user.last_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Hotel</p>
              <p className="font-semibold text-gray-900">{selectedReview.hotel.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Rating</p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < selectedReview.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-lg font-semibold text-gray-900">
                  {selectedReview.rating}.0
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Review</p>
              <p className="text-gray-700 leading-relaxed">{selectedReview.comment}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <Badge variant={selectedReview.is_approved ? 'success' : 'warning'}>
                {selectedReview.is_approved ? 'Approved' : 'Pending Approval'}
              </Badge>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Submitted</p>
              <p className="text-gray-900">{formatDate(selectedReview.created_at)}</p>
            </div>

            {!selectedReview.is_approved && (
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="danger"
                  onClick={() => {
                    handleReject(selectedReview.id);
                    close();
                  }}
                  className="flex-1"
                >
                  Reject Review
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    handleApprove(selectedReview.id);
                    close();
                  }}
                  className="flex-1"
                >
                  Approve Review
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewModeration;
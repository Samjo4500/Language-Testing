'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Star,
  Heart,
  Flag,
  UserPlus,
  ThumbsUp,
  MessageSquare,
  Shield,
} from 'lucide-react';

interface MatchFeedbackProps {
  partnerName?: string;
  matchId?: string;
  onSubmit?: (feedback: { rating: number; text: string; addFriend: boolean; report: boolean }) => void;
  onSkip?: () => void;
}

export default function MatchFeedback({
  partnerName = 'Your Partner',
  matchId,
  onSubmit,
  onSkip,
}: MatchFeedbackProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [addFriend, setAddFriend] = useState(false);
  const [report, setReport] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit?.({
      rating,
      text: feedbackText,
      addFriend,
      report,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
          <CardContent className="py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Thanks for your feedback!</h2>
            <p className="text-gray-400 text-sm mb-6">
              Your feedback helps improve the matching experience.
            </p>
            <Button
              onClick={onSkip}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Back to Community Live
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-gray-800 max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-xl text-white text-center">
            How was your conversation?
          </CardTitle>
          <p className="text-gray-400 text-sm text-center">
            Rate your session with {partnerName}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Star Rating */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-sm text-gray-400">
              {rating === 1 && 'Not great'}
              {rating === 2 && 'Below average'}
              {rating === 3 && 'It was okay'}
              {rating === 4 && 'Good conversation!'}
              {rating === 5 && 'Excellent match!'}
            </p>
          )}

          {/* Text Feedback */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Any feedback? (optional)
            </label>
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What could make this experience better?"
              className="bg-gray-800 border-gray-700 text-white resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setAddFriend(!addFriend)}
              className={`flex-1 ${
                addFriend
                  ? 'bg-pink-500/20 border-pink-500/30 text-pink-400'
                  : 'border-gray-700 text-gray-400'
              }`}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {addFriend ? 'Friend Request Sent' : 'Add as Friend'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setReport(!report)}
              className={`flex-1 ${
                report
                  ? 'bg-red-500/20 border-red-500/30 text-red-400'
                  : 'border-gray-700 text-gray-400'
              }`}
            >
              <Flag className="w-4 h-4 mr-2" />
              {report ? 'Reported' : 'Report'}
            </Button>
          </div>

          {report && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
              <p className="text-xs text-red-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Your report will be reviewed by our team. The other user will not know who reported them.
              </p>
            </div>
          )}

          {/* Submit / Skip */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={onSkip}
              className="flex-1 text-gray-400 hover:text-gray-300"
            >
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Heart className="w-4 h-4 mr-2" />
              Submit Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

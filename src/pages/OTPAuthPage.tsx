
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowLeft, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OTPAuthPage = () => {
  const { sendOTP, verifyOTP, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Add country code if not present
    if (digits.length > 0 && !digits.startsWith('91')) {
      return '+91' + digits;
    }
    
    return '+' + digits;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    
    const formattedPhone = formatPhoneNumber(phone);
    const { error } = await sendOTP(formattedPhone);
    
    if (error) {
      toast({
        title: "Failed to send OTP",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "OTP Sent!",
        description: "Please check your phone for the verification code."
      });
      setStep('otp');
      setCountdown(60); // 60 second countdown
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;

    setLoading(true);
    
    const formattedPhone = formatPhoneNumber(phone);
    const { error } = await verifyOTP(formattedPhone, otp);
    
    if (error) {
      toast({
        title: "Invalid OTP",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome!",
        description: "You have been signed in successfully."
      });
      navigate('/');
    }
    
    setLoading(false);
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    const formattedPhone = formatPhoneNumber(phone);
    const { error } = await sendOTP(formattedPhone);
    
    if (error) {
      toast({
        title: "Failed to resend OTP",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "OTP Resent!",
        description: "Please check your phone for the new verification code."
      });
      setCountdown(60);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="absolute left-4 top-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-800">VeggieMart</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              {step === 'phone' ? 'Enter Mobile Number' : 'Verify OTP'}
            </CardTitle>
            <CardDescription>
              {step === 'phone' 
                ? 'We\'ll send you a verification code via SMS'
                : `Enter the 6-digit code sent to ${phone}`
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter with country code (e.g., +91 for India)
                  </p>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={countdown > 0 || loading}
                      className="text-sm"
                    >
                      {countdown > 0 
                        ? `Resend OTP in ${countdown}s` 
                        : 'Resend OTP'
                      }
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setStep('phone');
                        setOtp('');
                        setCountdown(0);
                      }}
                      className="text-sm"
                    >
                      Change Mobile Number
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OTPAuthPage;

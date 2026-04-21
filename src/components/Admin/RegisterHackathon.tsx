'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

// Zod Schema - matches your MongoDB schema
const hackathonSchema = z.object({
  hackathonName: z.string().min(1, 'Hackathon name is required'),
  organization: z.string().min(1, 'Organization is required'),
  emailId: z
    .string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.enum(['active', 'inactive', 'completed']).default('active'),
  description: z.string().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.endDate >= data.startDate;
    }
    return true;
  },
  {
    message: 'End date must be after or equal to start date',
    path: ['endDate'],
  }
);

type HackathonFormData = z.infer<typeof hackathonSchema>;

interface HackathonFormProps {
  hackathonId?: string;
  heading: string;
  buttonLabel: string;
  setShowUpdateForm?: (show: boolean) => void;
  isUpdating?: boolean;
  setIsUpdating?: (isUpdating: boolean) => void | undefined;
  hackathonName?: string;
  emailId?: string;
  hackathonDescription?: string;
  hackathonStartDate?: Date;
  hackathonEndDate?: Date;
  hackathonOrganization?: string;
  status?: string;
}

const HackathonForm: React.FC<HackathonFormProps> = ({heading, buttonLabel = "Register", setShowUpdateForm, hackathonId, isUpdating, setIsUpdating, hackathonName, emailId, hackathonDescription, hackathonStartDate, hackathonEndDate, hackathonOrganization, status}) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<HackathonFormData>({
    resolver: zodResolver(hackathonSchema),
    defaultValues: {
      hackathonName:hackathonName || '',
      organization: hackathonOrganization || '',
      emailId: emailId || '',
      status: (status as 'active' | 'inactive' | 'completed') || 'active',
      description: hackathonDescription || '',
      startDate: hackathonStartDate || undefined,
      endDate: hackathonEndDate || undefined,
    },
  });

  const onSubmit = async (data: HackathonFormData) => {
    try {
      console.log('Form Data:', data);
      setLoading(true);
      const resp = await api.post('/admin/register-hackathon', { data });
      console.log('Response:', resp);
      if (resp.data.success) {
        toast.success('Hackathon registered successfully');
        form.reset();
      }
      setLoading(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      setLoading(false);
    }
  };

  const handleUpdate = async (data:HackathonFormData) => {
    try {
        const response = await api.put(`/admin/update-hackathon-status/${hackathonId}`, {data})
        
        if (response.data.success) {
          toast.success("Hackathon status updated successfully");
        }
    } catch (error) {
      toast.error("Failed to update hackathon status");
      console.log(error);
    }
    }

    const closeUpdateForm = () => {
      if (setIsUpdating) {
        setIsUpdating(false);
      }
      if (setShowUpdateForm) {
        setShowUpdateForm(false);
      }
    };

  return (
    <div className="flex items-center justify-center p-2 w-full">
      <div className="w-full max-w-2xl">
        <div
          className="bg-white rounded-lg shadow-lg p-4"
          style={{ borderColor: '#03257e' }}
        >
          <div className="flex justify-between items-center">
          <h2
            className="text-3xl font-bold mb-4 text-center text-gradient bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419] bg-clip-text text-transparent"
          >
            {heading}
          </h2>
          {isUpdating&&<X 
          size={24} 
          className="cursor-pointer shadow-lg rounded-full p-1" 
          onClick={closeUpdateForm}
          />}
          </div>

          <Form {...form}>
            <form onSubmit={isUpdating ? form.handleSubmit(handleUpdate) : form.handleSubmit(onSubmit)} noValidate className="space-y-2">
              {/* Hackathon Name */}
              <FormField
                control={form.control}
                name="hackathonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#03257e' }}>
                      Hackathon Name <span style={{ color: '#f14419' }}>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter hackathon name"
                        {...field}
                        className="border-2 focus:ring-2"
                        style={{
                          borderColor: form.formState.errors.hackathonName
                            ? '#f14419'
                            : 'gray-300',
                          color: '#03257e',
                        }}
                      />
                    </FormControl>
                    <FormMessage style={{ color: '#f14419' }} />
                  </FormItem>
                )}
              />

              {/* Organization */}
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#03257e' }}>
                      Organization <span style={{ color: '#f14419' }}>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter organization name"
                        {...field}
                        className="border-2 focus:ring-2"
                        style={{
                          borderColor: form.formState.errors.organization
                            ? '#f14419'
                            : 'gray-300',
                          color: '#03257e',
                        }}
                      />
                    </FormControl>
                    <FormMessage style={{ color: '#f14419' }} />
                  </FormItem>
                )}
              />

              {/* Email ID */}
              <FormField
                control={form.control}
                name="emailId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#03257e' }}>Email ID</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@example.com"
                        {...field}
                        className="border-2 focus:ring-2"
                        style={{
                          borderColor: form.formState.errors.emailId
                            ? '#f14419'
                            : 'gray-300',
                          color: '#03257e',
                        }}
                      />
                    </FormControl>
                    <FormMessage style={{ color: '#f14419' }} />
                  </FormItem>
                )}
              />

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel style={{ color: '#03257e' }}>
                        Start Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal border-2',
                                !field.value && 'text-muted-foreground'
                              )}
                              style={{
                                borderColor: 'gray-300',
                                color: field.value ? '#03257e' : undefined,
                              }}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            formatters={{
                              formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
                            }}
                            selected={field.value}
                            onSelect={field.onChange}
                            
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage style={{ color: '#f14419' }} />
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel style={{ color: '#03257e' }}>
                        End Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal border-2',
                                !field.value && 'text-muted-foreground'
                              )}
                              style={{
                                borderColor: form.formState.errors.endDate
                                  ? '#f14419'
                                  : 'gray-300',
                                color: field.value ? '#03257e' : undefined,
                              }}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date:any) =>
                              form.getValues('startDate')
                                ? date < form.getValues('startDate')!
                                : false
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage style={{ color: '#f14419' }} />
                    </FormItem>
                  )}
                />
              </div>

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#03257e' }}>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="border-2"
                          style={{
                            borderColor: 'gray-300',
                            color: '#03257e',
                          }}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage style={{ color: '#f14419' }} />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: '#03257e' }}>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter hackathon description..."
                        className="resize-none border-2"
                        rows={4}
                        {...field}
                        style={{
                          borderColor: 'gray-300',
                          color: '#03257e',
                        }}
                      />
                    </FormControl>
                    <FormMessage style={{ color: '#f14419' }} />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 text-white font-semibold hover:opacity-90"
                  style={{
                    backgroundColor: '#006666',
                  }}
                >
                  {loading ? isUpdating ? 'Updating...' : 'Creating...' : buttonLabel}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="border-2 font-semibold bg-[#f14419] text-white"
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default HackathonForm;
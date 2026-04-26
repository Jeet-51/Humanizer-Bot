
import { supabase } from "@/integrations/supabase/client";
import { PaymentRecord } from "./types";

export const createPaymentRecord = async (userId: string, plan: string, amount: number) => {
  const { data, error } = await supabase
    .from('payment_records')
    .insert([{ user_id: userId, plan, amount }])
    .select();

  if (error) throw error;
  return data[0] as PaymentRecord;
};

export const getPaymentHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('payment_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as PaymentRecord[];
};

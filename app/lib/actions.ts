// 服务器函数文件
'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// 用户登录 身份验证
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

// 类型验证
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: '请选择顾客.',
  }),
  amount: z.coerce.number().gt(0, '请输入正确金额.'),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: '请选择发票状态.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  // 转换成美元
  const amountInCents = amount * 100;
  // 发票新建时间
  const date = new Date().toISOString().split('T')[0];
  // sql插入数据
  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    return { message: '新增发票异常!' };
  }

  // 清除客户端缓存并发出新的服务器请求。
  revalidatePath('/dashboard/invoices');
  // 跳转
  redirect('/dashboard/invoices');
}

// 更新发票
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;

  try {
    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    return { message: '更新发票异常!' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// 删除发票
export async function deleteInvoice(id: string) {
  // throw new Error('Failed to Delete Invoice');

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    return { message: '删除发票异常!' };
  }
  revalidatePath('/dashboard/invoices');
  // 当前页面不需要跳转了
}

// 身份校验
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return '验证失败! Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
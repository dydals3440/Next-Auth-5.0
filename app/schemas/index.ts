import * as z from 'zod';

export const LoginSchema = z.object({
  // 첫번째 속성에는 message 속성이 없습니다. invalid_type_error를 활용하세요!
  email: z
    .string({
      invalid_type_error: 'Must be a string',
    })
    .email({
      message: '이메일을 작성해주세요!',
    }),
  password: z.string().min(1, {
    message: '비밀번호를 작성해주세요!',
  }),
});

export const RegisterSchema = z.object({
  // 첫번째 속성에는 message 속성이 없습니다. invalid_type_error를 활용하세요!
  email: z
    .string({
      invalid_type_error: 'Must be a string',
    })
    .email({
      message: '이메일을 작성해주세요!',
    }),
  password: z.string().min(6, {
    message: '비밀번호는 최소 6글자 이상 작성해주어야 합니다.',
  }),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
});

// Mock bcrypt to avoid RANDOMBYTESREQUEST
jest.mock('bcryptjs', () => ({
  genSaltSync: jest.fn().mockReturnValue('salt'),
  hashSync: jest.fn().mockReturnValue('hashedPassword'),
  compareSync: jest.fn().mockReturnValue(true),
}));

// Mock nodemailer to avoid SMTP connection
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn().mockResolvedValue(true),
    verify: jest.fn().mockResolvedValue(true),
  })),
}));

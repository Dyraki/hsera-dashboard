export type BankCategory = 'BUMN' | 'SWASTA' | 'BPD' | 'DIGITAL' | 'SYARIAH' | 'ASING';

export interface Bank {
  id: string;
  code: string;
  name: string;
  alias: string;
  category: BankCategory;
}


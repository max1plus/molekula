import { ScannerUI } from '@/components/scanner-ui';

export default function ScannerPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div>
        <h1 className="font-headline text-3xl font-bold">Сканер QR-кодов</h1>
        <p className="text-muted-foreground">
          Наведите камеру на QR-код или введите ID гостя для проверки.
        </p>
      </div>
      <ScannerUI />
    </div>
  );
}

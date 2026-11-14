import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { useState } from "react";
import { OutputCard } from "@/components/OutputCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getTranslations } from "@/translations";
import { QR_MAX_BYTES } from "@/lib/qr";

const t = getTranslations("en");

function renderCard(output: string, outputKind: "encrypted" | "decrypted" | null) {
  return render(
    <OutputCard
      output={output}
      outputKind={outputKind}
      isProcessing={false}
      onClearOutput={() => {}}
      onCopy={() => {}}
      onDownload={() => {}}
      onShare={() => {}}
      t={t}
    />
  );
}

afterEach(() => cleanup());

describe("OutputCard QR code", () => {
  it("renders a QR code for encrypted output within capacity", () => {
    renderCard("a".repeat(2000), "encrypted");
    fireEvent.click(screen.getByRole("button", { name: t.qrCode }));
    expect(screen.getByRole("button", { name: t.closeQr })).toBeTruthy();
    expect(screen.queryByText(t.qrFailed)).toBeNull();
  });

  it("offers Link and Text modes, defaults to Text on a non-HTTPS origin, and can switch", () => {
    renderCard("a".repeat(100), "encrypted");
    fireEvent.click(screen.getByRole("button", { name: t.qrCode }));
    const text = screen.getByRole("button", { name: t.qrModeText });
    const link = screen.getByRole("button", { name: t.qrModeLink });
    expect(text.getAttribute("aria-pressed")).toBe("true");
    expect(link.getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByText(t.qrHintText)).toBeTruthy();

    fireEvent.click(link);
    expect(link.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText(t.qrHintLink)).toBeTruthy();
    expect(screen.queryByText(t.qrFailed)).toBeNull();
  });

  it("shows a message instead of crashing when only the link form is too long", () => {
    renderCard("a".repeat(2300), "encrypted");
    fireEvent.click(screen.getByRole("button", { name: t.qrCode }));
    expect(screen.queryByText(t.qrModeTooLong)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: t.qrModeLink }));
    expect(screen.getByText(t.qrModeTooLong)).toBeTruthy();
    expect(screen.getByRole("button", { name: t.closeQr })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: t.qrModeText }));
    expect(screen.queryByText(t.qrModeTooLong)).toBeNull();
  });

  it("does not crash for output between the old (2,953) and real (2,331) limits", () => {
    renderCard("a".repeat(QR_MAX_BYTES + 200), "encrypted");
    fireEvent.click(screen.getByRole("button", { name: t.qrCode }));
    expect(screen.getByRole("button", { name: t.copy })).toBeTruthy();
    expect(screen.queryByRole("button", { name: t.closeQr })).toBeNull();
  });

  it("refuses to make a QR code from decrypted plaintext", () => {
    renderCard("my plaintext", "decrypted");
    fireEvent.click(screen.getByRole("button", { name: t.qrCode }));
    expect(screen.queryByRole("button", { name: t.closeQr })).toBeNull();
  });

  it("closes the QR code when the output changes", () => {
    function Harness() {
      const [output, setOutput] = useState("a".repeat(100));
      return (
        <>
          <button type="button" onClick={() => setOutput("b".repeat(100))}>swap</button>
          <OutputCard
            output={output}
            outputKind="encrypted"
            isProcessing={false}
            onClearOutput={() => {}}
            onCopy={() => {}}
            onDownload={() => {}}
            onShare={() => {}}
            t={t}
          />
        </>
      );
    }
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: t.qrCode }));
    expect(screen.getByRole("button", { name: t.closeQr })).toBeTruthy();
    fireEvent.click(screen.getByText("swap"));
    expect(screen.queryByRole("button", { name: t.closeQr })).toBeNull();
  });

  it("gives icon-only buttons accessible names and links the output label", () => {
    renderCard("x", "encrypted");
    expect(screen.getByLabelText(t.secureOutput)).toBeTruthy();
    for (const name of [t.copy, t.save, t.shareEncrypted, t.qrCode]) {
      expect(screen.getByRole("button", { name })).toBeTruthy();
    }
  });
});

describe("ErrorBoundary", () => {
  function Boom({ explode }: { explode: boolean }) {
    if (explode) throw new Error("boom");
    return <p>fine</p>;
  }

  it("shows the fallback instead of unmounting the app, and recovers when resetKey changes", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { rerender } = render(
      <ErrorBoundary resetKey="a" fallback={<p>fallback</p>}>
        <Boom explode />
      </ErrorBoundary>
    );
    expect(screen.getByText("fallback")).toBeTruthy();

    rerender(
      <ErrorBoundary resetKey="b" fallback={<p>fallback</p>}>
        <Boom explode={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText("fine")).toBeTruthy();
    spy.mockRestore();
  });
});

"use client";
import { useState, useEffect } from "react";

// ✅ TYPE
type MenuItem = {
  id: number;
  nama: string;
  gambar: string;
};

type CartItem = {
  id: number;
  nama: string;
  ukuran: string;
  harga: number;
  qty: number;
};

export default function Page() {
  const defaultMenu: MenuItem[] = [
    { id: 1, nama: "Es Teh", gambar: "/drink/es teh.png" },
    { id: 2, nama: "Es Kacang Merah", gambar: "/drink/es kacang merah.png" },
    { id: 3, nama: "Alpukat Kocok", gambar: "/drink/alpukat kocok.png" },
    { id: 4, nama: "Es Jagung", gambar: "/drink/es jagung.png" },
    { id: 5, nama: "Es Campur", gambar: "/drink/es campur.png" },
    { id: 6, nama: "Es Taro", gambar: "/drink/es taro.png" },
    { id: 7, nama: "Es Macha", gambar: "/drink/es macha.png" },
    { id: 8, nama: "Es Kuwut", gambar: "/drink/es kuwut.png" },
    { id: 9, nama: "Es Thai Tea", gambar: "/drink/thai tea.png" },
    { id: 10, nama: "Es Jeruk", gambar: "/drink/es jeruk.png" },
    { id: 11, nama: "Soda Lemon", gambar: "/drink/soda lemon.png" },
    { id: 12, nama: "Blue Lemon Soda", gambar: "/drink/blue lemon soda.png" },
    { id: 13, nama: "Es Dawet Ayu", gambar: "/drink/es dawet ayu.png" },
    { id: 14, nama: "Es Teler", gambar: "/drink/es teler.png" },
    { id: 15, nama: "Sop Buah", gambar: "/drink/sop buah.png" },
    { id: 16, nama: "Pisang Ijo", gambar: "/drink/pisang ijo.png" },
    { id: 17, nama: "Es Kopyor", gambar: "/drink/es kopyor.png" },
    { id: 18, nama: "Galaxy Lemonande", gambar: "/drink/galaxy lemonande.png" },
    { id: 19, nama: "Es Kepal Milo", gambar: "/drink/es kepal milo.png" },
    { id: 20, nama: "Es Ubi Ungu", gambar: "/drink/es ubi ungu.png" },
    { id: 21, nama: "Es Avocado Sago", gambar: "/drink/avocado.png" },
    { id: 22, nama: "Es Teh Hijau", gambar: "/drink/es teh hijau.png" },
    { id: 23, nama: "Es Cincau Brown Sugar", gambar: "/drink/es cincau  brown.png" },
    { id: 24, nama: "Es Jelly Ball Fruit", gambar: "/drink/es jely bal.png" },
  ];

  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

  const [menu, setMenu] = useState<MenuItem[]>(defaultMenu);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showQR, setShowQR] = useState(false);
  const [success, setSuccess] = useState(false);
  const [clickedId, setClickedId] = useState<number | null>(null);
  const [waktu, setWaktu] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✨ ANIMASI
  const styleAnimasi = `
    @keyframes goyang {
      0% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.05) rotate(-2deg); }
      50% { transform: scale(1.08) rotate(2deg); }
      75% { transform: scale(1.05) rotate(-2deg); }
      100% { transform: scale(1) rotate(0deg); }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/api/tes`);
        const text = await response.text();

        if (!response.ok) {
          throw new Error(text || "Backend tidak merespons");
        }

        let payload: unknown = text;
        try {
          payload = JSON.parse(text);
        } catch {
          payload = text;
        }

        if (Array.isArray(payload)) {
          setMenu(payload as MenuItem[]);
        } else if (payload && typeof payload === "object") {
          const data = payload as Record<string, unknown>;
          const nextMenu =
            (Array.isArray(data.menu) && (data.menu as MenuItem[])) ||
            (Array.isArray(data.items) && (data.items as MenuItem[])) ||
            (Array.isArray(data.data) && (data.data as MenuItem[])) ||
            defaultMenu;

          setMenu(nextMenu);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal terhubung ke backend";
        setError(message);
        setMenu(defaultMenu);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [API_URL]);

  // ⏰ JAM REALTIME
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      const format = now.toLocaleString(
        "id-ID",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        } as Intl.DateTimeFormatOptions
      );

      setWaktu(format);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ TAMBAH KE CART
  const tambahKeCart = (item: MenuItem, ukuran: "kecil" | "besar") => {
    const harga = ukuran === "kecil" ? 5000 : 10000;

    setClickedId(item.id);

    setTimeout(() => {
      setClickedId(null);
    }, 300);

    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.ukuran === ukuran
      );

      if (existing) {
        return prev.map((i) => {
          if (i.id === item.id && i.ukuran === ukuran) {
            return {
              ...i,
              qty: i.qty + 1,
            };
          }

          return i;
        });
      }

      return [
        ...prev,
        {
          id: item.id,
          nama: item.nama,
          ukuran,
          harga,
          qty: 1,
        },
      ];
    });
  };

  // 🗑️ HAPUS ITEM
  const hapusItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // 💰 TOTAL
  const total = cart.reduce(
    (acc: number, item: CartItem) =>
      acc + item.harga * item.qty,
    0
  );

  const kirimPesanan = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          total,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Gagal mengirim pesanan");
      }

      setShowQR(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Gagal mengirim pesanan";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // 💵 FORMAT RUPIAH
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
        padding: 20,
        background:
          "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)",
      }}
    >
      <style>{styleAnimasi}</style>

      {/* HEADER */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 30,
          animation: "fadeIn 0.6s ease",
        }}
      >
        <h1
          style={{
            color: "#ff4d6d",
            fontSize: 45,
            marginBottom: 10,
            fontWeight: "bold",
          }}
        >
          🍹 Es Terooosss
        </h1>

        <p
          style={{
            color: "#555",
            fontSize: 15,
          }}
        >
          {waktu}
        </p>

        {loading && (
          <p style={{ color: "#2563eb", marginTop: 8 }}>
            Memuat data dari backend...
          </p>
        )}

        {error && (
          <p style={{ color: "#b91c1c", marginTop: 8 }}>
            {error}
          </p>
        )}
      </div>

      {/* LAYOUT */}
      <div
        style={{
          display: "flex",
          gap: 30,
          alignItems: "flex-start",
        }}
      >
        {/* MENU */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(220px,1fr))",
            gap: 20,
            flex: 1,
          }}
        >
          {menu.map((item) => (
            <div
              key={item.id}
              style={{
                background:
                  clickedId === item.id
                    ? "rgba(255,255,255,0.96)"
                    : "rgba(255,255,255,0.82)",

                transform:
                  clickedId === item.id
                    ? "scale(1.06)"
                    : "scale(1)",

                animation:
                  clickedId === item.id
                    ? "goyang 0.3s ease"
                    : "fadeIn 0.5s ease",

                backdropFilter: "blur(15px)",
                borderRadius: 25,
                padding: 15,

                border: "2px solid rgba(255,255,255,0.5)",

                boxShadow:
                  clickedId === item.id
                    ? "0 0 25px rgba(255,105,180,0.5)"
                    : "0 10px 25px rgba(0,0,0,0.12)",

                transition: "all 0.3s ease",
              }}
            >
              {/* FOTO */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg,#ffffff,#f5f7fa)",
                  borderRadius: 20,
                  padding: 10,
                  marginBottom: 12,
                }}
              >
                <img
                  src={encodeURI(item.gambar)}
                  alt={item.nama}
                  onError={(event) => {
                    event.currentTarget.src = "/file.svg";
                  }}
                  style={{
                    width: "100%",
                    height: 140,
                    objectFit: "contain",
                    borderRadius: 15,
                  }}
                />
              </div>

              {/* NAMA */}
              <h3
                style={{
                  color: "#ff4d6d",
                  fontSize: 20,
                  marginBottom: 15,
                  fontWeight: "bold",
                  minHeight: 50,
                }}
              >
                {item.nama}
              </h3>

              {/* BUTTON */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <button
                  onClick={() => tambahKeCart(item, "kecil")}
                  style={btn1}
                >
                  🥤 Kecil - 5.000
                </button>

                <button
                  onClick={() => tambahKeCart(item, "besar")}
                  style={btn2}
                >
                  🧋 Besar - 10.000
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* KERANJANG */}
        <div
          style={{
            width: 360,
            position: "sticky",
            top: 20,
            background: "rgba(255,255,255,0.92)",
            padding: 25,
            borderRadius: 25,
            backdropFilter: "blur(15px)",
            border: "2px solid rgba(255,255,255,0.4)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          }}
        >
          <h2
            style={{
              color: "#ff4d6d",
              marginBottom: 20,
              fontSize: 28,
            }}
          >
            🛒 Keranjang ({cart.length})
          </h2>

          {cart.length === 0 && (
            <p style={{ color: "#666" }}>
              Belum ada pesanan
            </p>
          )}

          {cart.map((item, i) => (
            <div
              key={i}
              style={{
                marginBottom: 12,
                background: "#fff5f7",
                padding: 12,
                borderRadius: 15,
              }}
            >
              <b>
                {item.nama} ({item.ukuran})
              </b>

              <p style={{ color: "#555" }}>
                {formatRupiah(item.harga)} x {item.qty}
              </p>

              <button
                onClick={() => hapusItem(i)}
                style={{
                  background:
                    "linear-gradient(135deg,#ff758c,#ff7eb3)",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Hapus
              </button>
            </div>
          ))}

          <hr
            style={{
              border: "1px solid #ffd6de",
              margin: "20px 0",
            }}
          />

          <h3 style={{ color: "#ff4d6d" }}>
            Total: {formatRupiah(total)}
          </h3>

          {cart.length > 0 && (
            <button
              onClick={kirimPesanan}
              style={{ ...btnCheckout, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Mengirim..." : "Checkout Sekarang"}
            </button>
          )}
        </div>
      </div>

      {/* QR */}
      {showQR && (
        <div style={overlay}>
          <div style={popup}>
            <h2
              style={{
                color: "#ff4d6d",
                marginBottom: 15,
              }}
            >
              📱 Scan QRIS
            </h2>

            <img
              src="/drink/qr.png"
              alt="QR"
              width={220}
              style={{
                marginBottom: 20,
              }}
            />

            <button
              onClick={() => {
                setShowQR(false);
                setSuccess(true);
              }}
              style={btnBayar}
            >
              ✅ Sudah Bayar
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div style={overlay}>
          <div style={popup}>
            <h2
              style={{
                color: "#22c55e",
                marginBottom: 15,
              }}
            >
              🎉 Pembayaran Berhasil
            </h2>

            <p
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#444",
              }}
            >
              {formatRupiah(total)}
            </p>

            <button
              onClick={() => {
                setCart([]);
                setSuccess(false);
              }}
              style={btnPesan}
            >
              🍹 Pesan Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ✅ BUTTON KECIL
const btn1: React.CSSProperties = {
  background:
    "linear-gradient(135deg,#36d1dc,#5b86e5)",
  color: "white",
  border: "none",
  padding: "12px",
  borderRadius: 14,
  width: "100%",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 14,
  height: 48,
  boxShadow: "0 4px 12px rgba(91,134,229,0.4)",
};

// ✅ BUTTON BESAR
const btn2: React.CSSProperties = {
  background:
    "linear-gradient(135deg,#ff9a9e,#fecfef)",
  color: "#7a1f2b",
  border: "none",
  padding: "12px",
  borderRadius: 14,
  width: "100%",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: 14,
  height: 48,
  boxShadow: "0 4px 12px rgba(255,154,158,0.4)",
};

// ✅ BUTTON CHECKOUT
const btnCheckout: React.CSSProperties = {
  background:
    "linear-gradient(135deg,#f6d365,#fda085)",
  color: "#6b3e26",
  padding: 14,
  borderRadius: 14,
  width: "100%",
  border: "none",
  cursor: "pointer",
  marginTop: 10,
  fontWeight: "bold",
  fontSize: 16,
  boxShadow: "0 4px 14px rgba(253,160,133,0.4)",
};

// ✅ OVERLAY
const overlay: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backdropFilter: "blur(5px)",
};

// ✅ POPUP
const popup: React.CSSProperties = {
  background:
    "linear-gradient(135deg,#ffffff,#fff1f5)",
  padding: 30,
  borderRadius: 25,
  textAlign: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
};

// ✅ BUTTON SUDAH BAYAR
const btnBayar: React.CSSProperties = {
  background:
    "linear-gradient(135deg,#00c6ff,#0072ff)",
  color: "white",
  padding: "12px 20px",
  borderRadius: 14,
  border: "none",
  cursor: "pointer",
  marginTop: 10,
  fontWeight: "bold",
  fontSize: 15,
  boxShadow: "0 4px 12px rgba(0,114,255,0.4)",
};

// ✅ BUTTON PESAN LAGI
const btnPesan: React.CSSProperties = {
  background:
    "linear-gradient(135deg,#43e97b,#38f9d7)",
  color: "#155e63",
  padding: "12px 20px",
  borderRadius: 14,
  border: "none",
  cursor: "pointer",
  marginTop: 15,
  fontWeight: "bold",
  fontSize: 15,
  boxShadow: "0 4px 12px rgba(56,249,215,0.4)",
};
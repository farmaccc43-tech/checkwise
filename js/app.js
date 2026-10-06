const $ = (s) => document.querySelector(s),
  $$ = (s) => document.querySelectorAll(s);
const types = {
  message: {
    title: "Phân tích tin nhắn",
    hint: "Dán nội dung SMS, Zalo, Messenger hoặc email vào ô bên dưới.",
    placeholder:
      "Ví dụ: “Tài khoản của bạn sắp bị khóa. Hãy bấm vào đường link để xác minh ngay...”",
  },
  link: {
    title: "Phân tích đường link",
    hint: "Dán URL bạn nhận được để kiểm tra các dấu hiệu đáng ngờ.",
    placeholder: "",
  },
  image: {
    title: "Phân tích hình ảnh",
    hint: "Tải ảnh tin nhắn, QR hoặc ảnh website cần kiểm tra.",
    placeholder: "",
  },
  audio: {
    title: "Phân tích âm thanh",
    hint: "Tải ghi âm cuộc gọi hoặc đoạn âm thanh cần kiểm tra.",
    placeholder: "",
  },
  video: {
    title: "Phân tích video",
    hint: "Tải video để kiểm tra các dấu hiệu đáng ngờ.",
    placeholder: "",
  },
};
let currentType = "message";
const messageInput = $("#messageInput"),
  linkInput = $("#linkInput"),
  uploadInput = $("#uploadInput"),
  fileField = $("#fileField"),
  filePreview = $("#filePreview");
$$(".type-btn").forEach((btn) =>
  btn.addEventListener("click", () => {
    currentType = btn.dataset.type;
    $$(".type-btn").forEach((x) => x.classList.remove("active"));
    btn.classList.add("active");
    const t = types[currentType];
    $("#inputTitle").textContent = t.title;
    $("#inputHint").textContent = t.hint;
    messageInput.classList.toggle("hidden", currentType !== "message");
    linkInput.classList.toggle("hidden", currentType !== "link");
    uploadInput.classList.toggle(
      "hidden",
      !["image", "audio", "video"].includes(currentType),
    );
    messageInput.placeholder = t.placeholder;
    $("#charCount").textContent = "0 ký tự";
  }),
);
messageInput.addEventListener(
  "input",
  () => ($("#charCount").textContent = messageInput.value.length + " ký tự"),
);
fileField.addEventListener("change", () => {
  const f = fileField.files[0];
  filePreview.innerHTML = f
    ? `<div class="file-chip"><i class="fa-solid fa-file"></i> ${f.name} • ${(f.size / 1024 / 1024).toFixed(2)} MB</div>`
    : "";
});
$("#menuBtn").addEventListener("click", () =>
  $("#nav").classList.toggle("open"),
);
const themeBtn = $("#themeBtn");
const savedTheme = localStorage.getItem("deepguard-theme");
if (savedTheme === "light") document.body.classList.add("light");

function updateThemeIcon() {
  const icon = themeBtn.querySelector("i");
  const isLight = document.body.classList.contains("light");
  icon.className = isLight ? "fa-solid fa-sun" : "fa-solid fa-moon";
  themeBtn.setAttribute(
    "aria-label",
    isLight ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng",
  );
  themeBtn.title = isLight ? "Giao diện sáng" : "Giao diện tối";
}

updateThemeIcon();

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("deepguard-theme", isLight ? "light" : "dark");
  updateThemeIcon();
});
$("#analyzeBtn").addEventListener("click", () => {
  const has =
    currentType === "message"
      ? messageInput.value.trim()
      : currentType === "link"
        ? $("#urlField").value.trim()
        : fileField.files.length;
  if (!has) {
    alert(
      currentType === "message"
        ? "Hãy nhập nội dung cần kiểm tra."
        : "Hãy cung cấp dữ liệu trước khi phân tích.",
    );
    return;
  }
  const btn = $("#analyzeBtn");
  btn.disabled = true;
  btn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Đang phân tích...';
  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-bolt"></i> Phân tích AI';
    showResult();
  }, 1100);
});
function showResult() {
  let score = 58;
  if (currentType === "message") {
    const s = messageInput.value.toLowerCase();
    const hits = [
      "otp",
      "mật khẩu",
      "chuyển tiền",
      "tài khoản",
      "khẩn cấp",
      "xác minh",
      "trúng thưởng",
      "công an",
      "phạt",
      "link",
    ].filter((x) => s.includes(x));
    score = Math.min(96, 42 + hits.length * 8);
  } else if (currentType === "link") {
    const u = $("#urlField").value.toLowerCase();
    score =
      u.includes("http://") ||
      u.includes("@") ||
      u.length > 80 ||
      /(\.tk|\.top|\.xyz|\.click)(\/|$)/.test(u)
        ? 82
        : 38;
  } else score = 64;
  const level = score >= 75 ? "high" : score >= 50 ? "medium" : "low";
  const title =
    level === "high"
      ? "Có nhiều dấu hiệu đáng ngờ"
      : level === "medium"
        ? "Cần cảnh giác với nội dung này"
        : "Ít dấu hiệu đáng ngờ được phát hiện";
  $("#resultTitle").textContent = title;
  $("#riskScore").textContent = score + "/100";
  $("#riskBadge").className = "risk " + level;
  $("#riskBadge").textContent =
    level === "high"
      ? "RỦI RO CAO"
      : level === "medium"
        ? "CẦN CẢNH GIÁC"
        : "RỦI RO THẤP";
  $("#findings").innerHTML = (
    level === "high"
  ? [
      [
        "fa-clock",
        "Tạo áp lực",
        "Nội dung có thể sử dụng cách diễn đạt khẩn cấp, thúc giục bạn phải hành động nhanh hoặc tạo cảm giác nếu không thực hiện ngay thì sẽ xảy ra hậu quả.",
      ],
      [
        "fa-key",
        "Yêu cầu thông tin",
        "Có dấu hiệu liên quan đến tài khoản, mật khẩu, mã OTP, thông tin xác thực hoặc các dữ liệu cá nhân mà người dùng không nên cung cấp khi chưa xác minh.",
      ],
      [
        "fa-link",
        "Kênh không chắc chắn",
        "Nội dung có thể chứa liên kết hoặc hướng dẫn truy cập vào một kênh chưa được xác minh. Không nên mở liên kết hoặc cung cấp dữ liệu trước khi kiểm tra nguồn.",
      ],
    ]
  : level === "medium"
    ? [
        [
          "fa-circle-question",
          "Thiếu dấu hiệu rõ ràng",
          "Nội dung chưa cung cấp đủ thông tin để xác định mức độ đáng tin cậy. Bạn nên kiểm tra thêm người gửi, nguồn thông tin và hoàn cảnh trước khi thực hiện bất kỳ hành động nào.",
        ],
        [
          "fa-magnifying-glass",
          "Xác minh thêm",
          "Hãy tìm thông tin từ website, ứng dụng hoặc kênh chính thức của tổ chức liên quan để đối chiếu nội dung trước khi nhấp vào liên kết hoặc phản hồi.",
        ],
        [
          "fa-shield-halved",
          "Bảo vệ dữ liệu",
          "Không cung cấp OTP, mật khẩu, mã xác nhận, thông tin tài khoản hoặc dữ liệu cá nhân nhạy cảm nếu chưa chắc chắn về danh tính và mục đích của người yêu cầu.",
        ],
      ]
    : [
        [
          "fa-circle-check",
          "Không thấy dấu hiệu mạnh",
          "Phân tích mô phỏng hiện chưa phát hiện những tín hiệu đáng ngờ nổi bật trong nội dung. Tuy nhiên, kết quả này không đồng nghĩa với việc nội dung chắc chắn an toàn.",
        ],
        [
          "fa-user-check",
          "Kiểm tra nguồn",
          "Bạn vẫn nên xác minh người gửi, địa chỉ liên hệ và nguồn xuất phát của nội dung để đảm bảo thông tin thực sự đến từ cá nhân hoặc tổ chức đáng tin cậy.",
        ],
        [
          "fa-shield-halved",
          "Tiếp tục thận trọng",
          "AI chỉ đưa ra đánh giá dựa trên các tín hiệu được phân tích và không thể đảm bảo nội dung an toàn tuyệt đối. Hãy kiểm tra kỹ trước khi cung cấp thông tin hoặc thực hiện hành động.",
        ],
      ]
  )
    .map(
      (x) =>
        `<div class="finding"><i class="fa-solid ${x[0]}"></i><strong>${x[1]}</strong><p>${x[2]}</p></div>`,
    )
    .join("");
  const sec = $("#result");
  sec.classList.remove("hidden");
  sec.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => ($("#meterFill").style.width = score + "%"), 100);
}
$("#newCheck").addEventListener("click", () =>
  $("#checker").scrollIntoView({ behavior: "smooth" }),
);
$("#copyResult").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(
      `DeepGuard AI: ${$("#resultTitle").textContent} — ${$("#riskScore").textContent}`,
    );
    alert("Đã sao chép kết quả.");
  } catch (e) {}
});
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("show");
    }),
  { threshold: 0.12 },
);
$$(".reveal").forEach((x) => io.observe(x));
const cio = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        const n = e.target.dataset.count;
        if (n) {
          let i = 0;
          const t = setInterval(() => {
            i++;
            e.target.textContent = i;
            if (i >= +n) clearInterval(t);
          }, 45);
        }
      }
    }),
  { threshold: 0.8 },
);
$$("[data-count]").forEach((x) => cio.observe(x));

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from .my_constants import MyConstants

def send_email(email, user_id, token):
    # Thiết lập nội dung email
    subject = 'Signup | Verification'
    body = f"Thanks for signing up, please input these informations to activate your account:\n\t.id: {user_id}\n\t.token: {token}"

    # Tạo thư điện tử
    msg = MIMEMultipart()
    msg['From'] = MyConstants.EMAIL_USER
    msg['To'] = email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Kết nối đến máy chủ SMTP của Office365
        with smtplib.SMTP('smtp.office365.com', 587) as server:
            server.starttls()  # Bật mã hóa TLS
            server.login(MyConstants.EMAIL_USER, MyConstants.EMAIL_PASS)  # Đăng nhập với thông tin người dùng
            text = msg.as_string()  # Chuyển đổi message thành dạng chuỗi
            server.sendmail(MyConstants.EMAIL_USER, email, text)  # Gửi email
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

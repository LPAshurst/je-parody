FROM rust:trixie

WORKDIR /backend

COPY . .

ENV SQLX_OFFLINE=true

RUN cargo build --release

CMD ["./target/release/rust-server"]
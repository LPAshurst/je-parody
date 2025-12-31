FROM rust:trixie

WORKDIR /backend

COPY . .

RUN cargo build --release

CMD ["./target/release/rust-server"]
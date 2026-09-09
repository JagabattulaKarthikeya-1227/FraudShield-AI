import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
import os
import sys

# Paths
base_dir = r"c:\Users\J.Karthikeya\OneDrive\Desktop\credit 3.0"
data_path = os.path.join(base_dir, "backend", "app", "ml", "data", "processed", "creditcard_enhanced.csv")
output_pdf = os.path.join(base_dir, "dataset_report.pdf")

def generate_report():
    print(f"Loading dataset from {data_path}...")
    try:
        df = pd.read_csv(data_path)
    except Exception as e:
        print(f"Error loading dataset: {e}")
        sys.exit(1)

    print("Dataset loaded successfully. Generating PDF...")
    
    with PdfPages(output_pdf) as pdf:
        # 1. Dataset Overview
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.axis('off')
        
        info_text = (
            f"Dataset Overview\n\n"
            f"Total Rows: {len(df)}\n"
            f"Total Columns: {len(df.columns)}\n\n"
            f"Missing Values: {df.isnull().sum().sum()}\n\n"
            f"Class Distribution:\n"
            f"Normal (0): {len(df[df['Class'] == 0])}\n"
            f"Fraud (1): {len(df[df['Class'] == 1])}\n"
            f"Fraud Percentage: {(len(df[df['Class'] == 1]) / len(df)) * 100:.3f}%"
        )
        
        ax.text(0.1, 0.5, info_text, fontsize=14, verticalalignment='center')
        pdf.savefig(fig)
        plt.close()

        # 2. Class Distribution Plot
        fig, ax = plt.subplots(figsize=(8, 6))
        class_counts = df['Class'].value_counts()
        class_counts.plot(kind='bar', ax=ax, color=['blue', 'red'])
        ax.set_title("Class Distribution")
        ax.set_xlabel("Class (0: Normal, 1: Fraud)")
        ax.set_ylabel("Count")
        pdf.savefig(fig)
        plt.close()

        # 3. Amount Distribution
        fig, ax = plt.subplots(figsize=(8, 6))
        # Log scale because amounts are highly skewed
        df[df['Class'] == 0]['Amount'].plot(kind='hist', bins=50, alpha=0.5, ax=ax, color='blue', label='Normal (log)', logy=True)
        df[df['Class'] == 1]['Amount'].plot(kind='hist', bins=50, alpha=0.5, ax=ax, color='red', label='Fraud (log)', logy=True)
        ax.set_title("Transaction Amount Distribution")
        ax.set_xlabel("Amount")
        ax.set_ylabel("Frequency (Log Scale)")
        ax.legend()
        pdf.savefig(fig)
        plt.close()

    print(f"Report successfully saved to {output_pdf}")

if __name__ == '__main__':
    generate_report()

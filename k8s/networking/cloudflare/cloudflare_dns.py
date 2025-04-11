#!/usr/bin/env python3
"""
Cloudflare DNS Configuration Script for ScanPro KubeSphere Deployment

This script configures DNS records in Cloudflare for the ScanPro application.
It creates or updates A records, CNAME records, and configures Cloudflare settings.

Usage:
  python cloudflare_dns.py --config cloudflare_config.yaml
  python cloudflare_dns.py --api-key YOUR_API_KEY --email YOUR_EMAIL --zone ZONE_ID --domain example.com

Requirements:
  pip install requests pyyaml
"""

import argparse
import json
import os
import sys
import time
import yaml
import requests
from typing import Dict, List, Optional, Any

class CloudflareAPI:
    """Cloudflare API client for DNS management"""
    
    BASE_URL = "https://api.cloudflare.com/client/v4"
    
    def __init__(self, api_key: str, email: str, zone_id: str):
        self.api_key = api_key
        self.email = email
        self.zone_id = zone_id
        self.headers = {
            "X-Auth-Email": email,
            "X-Auth-Key": api_key,
            "Content-Type": "application/json"
        }
    
    def get_zone_details(self) -> Dict:
        """Get details about the specified zone"""
        url = f"{self.BASE_URL}/zones/{self.zone_id}"
        response = requests.get(url, headers=self.headers)
        response.raise_for_status()
        return response.json()
    
    def get_dns_records(self, record_type: Optional[str] = None) -> List[Dict]:
        """Get all DNS records or filter by type"""
        url = f"{self.BASE_URL}/zones/{self.zone_id}/dns_records"
        params = {}
        if record_type:
            params["type"] = record_type
        
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        return response.json()["result"]
    
    def create_dns_record(self, record_type: str, name: str, content: str, ttl: int = 1, proxied: bool = True) -> Dict:
        """Create a new DNS record"""
        url = f"{self.BASE_URL}/zones/{self.zone_id}/dns_records"
        data = {
            "type": record_type,
            "name": name,
            "content": content,
            "ttl": ttl,
            "proxied": proxied
        }
        
        response = requests.post(url, headers=self.headers, data=json.dumps(data))
        response.raise_for_status()
        return response.json()["result"]
    
    def update_dns_record(self, record_id: str, record_type: str, name: str, content: str, ttl: int = 1, proxied: bool = True) -> Dict:
        """Update an existing DNS record"""
        url = f"{self.BASE_URL}/zones/{self.zone_id}/dns_records/{record_id}"
        data = {
            "type": record_type,
            "name": name,
            "content": content,
            "ttl": ttl,
            "proxied": proxied
        }
        
        response = requests.put(url, headers=self.headers, data=json.dumps(data))
        response.raise_for_status()
        return response.json()["result"]
    
    def delete_dns_record(self, record_id: str) -> bool:
        """Delete a DNS record"""
        url = f"{self.BASE_URL}/zones/{self.zone_id}/dns_records/{record_id}"
        response = requests.delete(url, headers=self.headers)
        response.raise_for_status()
        return response.json()["success"]
    
    def ensure_dns_record(self, record_type: str, name: str, content: str, ttl: int = 1, proxied: bool = True) -> Dict:
        """Create or update a DNS record"""
        # Check if record exists
        records = self.get_dns_records(record_type)
        for record in records:
            if record["name"] == name:
                print(f"Updating existing {record_type} record for {name}")
                return self.update_dns_record(record["id"], record_type, name, content, ttl, proxied)
        
        print(f"Creating new {record_type} record for {name}")
        return self.create_dns_record(record_type, name, content, ttl, proxied)
    
    def update_zone_settings(self, settings: Dict[str, Any]) -> Dict:
        """Update zone settings"""
        url = f"{self.BASE_URL}/zones/{self.zone_id}/settings"
        # Update settings one by one
        results = {}
        for setting, value in settings.items():
            setting_url = f"{url}/{setting}"
            data = {"value": value}
            try:
                response = requests.patch(setting_url, headers=self.headers, data=json.dumps(data))
                response.raise_for_status()
                results[setting] = response.json()["result"]
                print(f"Updated {setting} setting to {value}")
            except requests.exceptions.HTTPError as e:
                print(f"Failed to update {setting}: {e}")
                results[setting] = {"error": str(e)}
        
        return results

def load_config(config_path: str) -> Dict:
    """Load configuration from YAML file"""
    with open(config_path, 'r') as f:
        return yaml.safe_load(f)

def main():
    parser = argparse.ArgumentParser(description="Configure Cloudflare DNS for ScanPro")
    
    # Either specify config file or individual parameters
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--config", help="Path to YAML configuration file")
    group.add_argument("--api-key", help="Cloudflare API key")
    
    # Optional parameters when not using config file
    parser.add_argument("--email", help="Cloudflare account email")
    parser.add_argument("--zone", help="Cloudflare zone ID")
    parser.add_argument("--domain", help="Domain name")
    parser.add_argument("--server-ip", help="Server IP address")
    
    args = parser.parse_args()
    
    if args.config:
        try:
            config = load_config(args.config)
        except Exception as e:
            print(f"Error loading config file: {e}")
            sys.exit(1)
    else:
        # Validate required parameters
        if not all([args.email, args.zone]):
            print("Error: When not using a config file, --email and --zone are required")
            parser.print_help()
            sys.exit(1)
        
        config = {
            "cloudflare": {
                "api_key": args.api_key,
                "email": args.email,
                "zone_id": args.zone,
                "domain": args.domain,
                "server_ip": args.server_ip
            }
        }
    
    cf_config = config["cloudflare"]
    api_key = cf_config["api_key"]
    email = cf_config["email"]
    zone_id = cf_config["zone_id"]
    domain = cf_config["domain"]
    server_ip = cf_config.get("server_ip")
    
    # If server IP is not provided, try to get it
    if not server_ip:
        try:
            response = requests.get("https://api.ipify.org?format=json")
            server_ip = response.json()["ip"]
            print(f"Auto-detected server IP: {server_ip}")
        except Exception as e:
            print(f"Error auto-detecting server IP: {e}")
            print("Please specify the server IP with --server-ip or in the config file")
            sys.exit(1)
    
    # Initialize Cloudflare API
    cf = CloudflareAPI(api_key, email, zone_id)
    
    try:
        # Verify connection
        zone_details = cf.get_zone_details()
        print(f"Connected to Cloudflare zone: {zone_details['result']['name']}")
        
        # Set up DNS records
        domains = config.get("domains", [])
        if not domains:
            # Default setup if no specific domains provided
            domains = [
                {"name": domain, "type": "A", "content": server_ip, "proxied": True},
                {"name": f"*.{domain}", "type": "A", "content": server_ip, "proxied": True}
            ]
        
        # Create/update each DNS record
        for record in domains:
            record_type = record.get("type", "A")
            name = record.get("name")
            content = record.get("content", server_ip)
            ttl = record.get("ttl", 1)
            proxied = record.get("proxied", True)
            
            if not name:
                print(f"Skipping record with no name: {record}")
                continue
                
            try:
                result = cf.ensure_dns_record(record_type, name, content, ttl, proxied)
                print(f"Successfully configured {record_type} record for {name} -> {content}")
            except Exception as e:
                print(f"Error configuring {record_type} record for {name}: {e}")
        
        # Update zone settings if specified
        if "settings" in config:
            cf.update_zone_settings(config["settings"])
        
        print("\nCloudflare DNS configuration complete!")
        print(f"ScanPro should now be accessible at: https://{domain}")
        
    except Exception as e:
        print(f"Error configuring Cloudflare DNS: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()